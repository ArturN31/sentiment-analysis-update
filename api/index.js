const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

//used to scrape article data
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT;

//Cors policy setup
const cors = require('cors');
app.use(
	cors({
		origin: 'https://sentiment-analysis-client.vercel.app/',
	}),
);

app.use(express.urlencoded({ extended: false })); //body parser
app.use(express.json()); //parses incoming json to the req.body

// Have Node serve the files for built React app
app.use(express.static(path.resolve(__dirname, '../client/dist')));

var Analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;
var analyzer = new Analyzer('English', stemmer, 'afinn');

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

// Function to perform sentiment analysis based on a given score
const sentimentAnalysis = (score, textToTokenize) => {
	// Object containing sentiment categories and their associated data
	const sentimentData = {
		'very positive': {
			emotion: ['elation', 'exhilaration', 'delight', 'enthusiasm', 'gratitude'],
			positivityLevel: 'high',
			intensity: 'strong',
		},
		positive: {
			emotion: ['happiness', 'contentment', 'optimism', 'satisfaction', 'hope'],
			positivityLevel: 'moderate',
			intensity: 'moderate',
		},
		'slightly positive': {
			emotion: ['pleasure', 'interest', 'cheerfulness', 'amusement', 'relief'],
			positivityLevel: 'low',
			intensity: 'mild',
		},
		neutral: {
			emotion: ['equanimity', 'objectivity', 'detachment', 'calmness', 'acceptance'],
			positivityLevel: 'neutral',
			intensity: 'neutral',
		},
		'slightly negative': {
			emotion: ['disappointment', 'worry', 'pessimism', 'concern', 'doubt'],
			positivityLevel: 'low',
			intensity: 'mild',
		},
		negative: {
			emotion: ['sadness', 'frustration', 'anger', 'regret', 'resentment'],
			positivityLevel: 'moderate',
			intensity: 'negative',
		},
		'very negative': {
			emotion: ['despair', 'grief', 'rage', 'helplessness', 'bitterness'],
			positivityLevel: 'low',
			intensity: 'strong',
		},
	};

	// Iterate over sentimentData to find the appropriate sentiment category based on the score
	for (const sentiment in sentimentData) {
		const { lowerThreshold, upperThreshold } = getThresholds(sentiment);

		if (score > lowerThreshold && score <= upperThreshold) {
			// Return the sentiment analysis result
			return {
				sentiment,
				description: [
					`The analysed text reflects a ${sentiment.toLowerCase()} sentiment with a score of ${score.toFixed(2)}.`,
					`It elicits emotions of ${sentimentData[sentiment].emotion.join(', ')}.`,
					`The positivity level is categorised as ${sentimentData[sentiment].positivityLevel}, indicating ${
						sentimentData[sentiment].intensity === 'neutral'
							? 'an absence of strong positive or negative emotions'
							: `a ${sentimentData[sentiment].intensity.toLowerCase()} impact of the text`
					}.`,
				],
				analysedText: textToTokenize,
			};
		}
	}

	// Sentiment cannot be determined
	return {
		sentiment: 'Unknown',
		description: [
			'The sentiment of the analyzed text could not be determined.',
			'Please check the input and try again.',
		],
	};
};

// Function to retrieve the lower and upper score thresholds for a given sentiment category
const getThresholds = (sentiment) => {
	// Object containing the score thresholds for each sentiment category
	const thresholds = {
		'very positive': { lowerThreshold: 0.8, upperThreshold: 1 },
		positive: { lowerThreshold: 0.4, upperThreshold: 0.8 },
		'slightly positive': { lowerThreshold: 0.1, upperThreshold: 0.4 },
		neutral: { lowerThreshold: -0.1, upperThreshold: 0.1 },
		'slightly negative': { lowerThreshold: -0.4, upperThreshold: -0.1 },
		negative: { lowerThreshold: -0.8, upperThreshold: -0.4 },
		'very negative': { lowerThreshold: -1, upperThreshold: -0.8 },
	};

	return thresholds[sentiment];
};

app.post('/api/sentimentAnalysis', async (req, res) => {
	const textToTokenize = req.body.text;

	if (textToTokenize === '') {
		const response = {
			error: 'Missing text for sentiment analysis.',
		};
		res.status(400).json(response); // Use res.json() to send JSON data
		return;
	}

	const tokenizedText = tokenizer.tokenize(textToTokenize);
	const sentimentScore = analyzer.getSentiment(tokenizedText);
	const sentiment = sentimentAnalysis(sentimentScore, textToTokenize);

	res.status(200).send(sentiment); // Send sentiment data as JSON
});

app.post('/api/getNewsByTheme', async (req, res) => {
	const theme = req.body.theme;
	//reset stored news - ensures that updated version is pulled when calling api from client
	const newsArray = [];

	//fetches news from NY Times API
	const url = `https://api.nytimes.com/svc/topstories/v2/${theme}.json?api-key=`;
	try {
		const response = await fetch(url + process.env.NY_TIMES_API);

		if (!response.ok) throw response;

		const incomingData = await response.json();

		for (let i = 0; i < incomingData.results.length; i++) {
			if (!incomingData.results[i].url || incomingData.results[i].url === 'null') {
				//returns articles with no urls
			} else {
				//returns articles with urls
				newsArray.push(incomingData.results[i]);
			}
		}
		res.status(200).send(newsArray);
	} catch (err) {
		console.error(err);
		res.status(500).end();
	}
});

app.post('/api/scrapeArticleData', async (req, res) => {
	const articleURL = req.body.url;
	//reset stored news text - ensures that updated version is pulled when calling api from client
	let scrapedArticleData = {};
	try {
		const response = await fetch(articleURL);

		if (!response.ok) throw response;

		const data = await response.text();

		if (!data.includes('geo.captcha-delivery.com')) {
			//scrape article text
			const $ = cheerio.load(data);
			const getArticle = $('article');
			scrapedArticleData = { text: getArticle.find('section').find('p.css-at9mc1').contents().text() };
		} else {
			scrapedArticleData = {
				error:
					'Unfortunately, due to a captcha blocking access, the article text cannot be retrieved. This prevents the system from obtaining the necessary news data for processing.',
			};
		}
		res.status(200).send(await scrapedArticleData);
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
});

app.post('/api/getNewsByDate', async (req, res) => {
	const { month, year } = req.body;

	//reset stored news - ensures that updated version is pulled when calling api from client
	const newsArray = [];

	try {
		const NYTimesAPI = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=`;
		const response = await fetch(NYTimesAPI + process.env.NY_TIMES_API);

		if (!response.ok) throw response;

		const incomingData = await response.json();

		for (let i = 0; i < incomingData.response.docs.length; i++) {
			if (!incomingData.response.docs[i].web_url || incomingData.response.docs[i].web_url === 'null') {
				//returns articles with no urls
				//console.log(incomingData.results[i]);
			} else {
				//returns articles with urls
				newsArray.push(incomingData.response.docs[i]);
			}
		}
		res.status(200).send(JSON.stringify(newsArray));
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
});

app.post('/api/getCoordinates', async (req, res) => {
	const { geolocation } = req.body;

	try {
		const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(geolocation)}&format=json`;

		const response = await fetch(url);

		if (!response.ok) throw coordinates;

		const incomingData = await response.json();

		const coordinates = {
			latitude: incomingData[0].lat,
			longitude: incomingData[0].lon,
		};

		res.status(200).send(JSON.stringify(coordinates));
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
});

//will return build of React app
// app.get('/', (req, res) => {
// 	res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
// });

app.listen(PORT, (error) => {
	if (!error) {
		console.log(`[server]: Server is running at:\n[server]: http://localhost:${PORT}`);
	} else {
		console.log(`[server]: Server run into a problem:\n[server]: ${error}`);
	}
});

module.exports = app;
