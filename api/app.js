const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT;

//Cors policy setup
const cors = require('cors');
app.use(cors());

app.use(express.urlencoded({ extended: false })); //body parser
app.use(express.json()); //parses incoming json to the req.body

var Analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;
var analyzer = new Analyzer('English', stemmer, 'afinn');

var natural = require('natural');
var tokenizer = new natural.WordTokenizer();

let textToTokenize = '';

app.post('/api/sentimentAnalysis', (req, res) => {
	textToTokenize = req.body.text;
	res.sendStatus(200);
	res.end();
});

app.get('/api/sentimentAnalysis', (req, res) => {
	if (textToTokenize === '') {
		const response = {
			error: 'Missing text for sentiment analysis.',
		};
		res.status(400);
		res.send(response);
	}

	const tokenizedText = tokenizer.tokenize(textToTokenize);
	const sentimentScore = analyzer.getSentiment(tokenizedText);

	// Function to perform sentiment analysis based on a given score
	const sentimentAnalysis = (score) => {
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

	const response = {
		// passedText: textToTokenize,
		// tokenizedText: tokenizedText,
		...sentimentAnalysis(sentimentScore),
	};

	res.setHeader('Content-Type', 'application/json');
	res.status(200);
	res.send(response);
});

let theme = '';
let newsArray = [];

app.post('/api/getNewsByTheme', (req, res) => {
	theme = req.body.theme;

	//fetches news from NY Times API
	const url = `https://api.nytimes.com/svc/topstories/v2/${theme}.json?api-key=`;
	fetch(url + process.env.NY_TIMES_API)
		.then(async (response) => {
			if (!response.ok) {
				throw response;
			}
			return await response.json();
		})
		.then((incomingData) => {
			console.log(incomingData);

			for (let i = 0; i < incomingData.results.length; i++) {
				if (!incomingData.results[i].url || incomingData.results[i].url === 'null') {
					//returns articles with no urls
					//console.log(incomingData.results[i]);
				} else {
					//returns articles with urls
					newsArray.push(incomingData.results[i]);
				}
			}
		})
		.catch((err) => console.error(err));

	res.status(200);
	res.end();
});

app.get('/api/getNewsByTheme', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.status(200);
	res.send(newsArray);
});

app.listen(PORT, (error) => {
	if (!error) {
		console.log(`[server]: Server is running at:\n[server]: http://localhost:${PORT}`);
	} else {
		console.log(`[server]: Server run into a problem:\n[server]: ${error}`);
	}
});
