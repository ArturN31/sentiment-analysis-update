//setup express app
const express = require('express');
const app = express();

//loads .env
const dotenv = require('dotenv');
dotenv.config();

//CORS policy setup
const cors = require('cors');
app.use(
	cors({
		origin: '*',
	}),
);

app.use(express.urlencoded({ extended: false })); //body parser
app.use(express.json()); //parses incoming json to the req.body

app.options('/api/sentimentAnalysis', (req, res) => {
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.sendStatus(200); // Successful pre-flight response
});

app.post('/api/sentimentAnalysis', async (req, res) => {
	const textToTokenize = req.body.text;
	const purpose = req.body.purpose

	//require the Natural library for sentiment analysis
	const natural = require('natural');

	//require the VaderSentiment library for additional sentiment analysis
	const vaderSentiment = require('vader-sentiment');

	const { categoriseSentiment } = require('./sentimentAnalysis');

	//define aliases for commonly used classes from Natural
	const Analyzer = natural.SentimentAnalyzer;
	const stemmer = natural.PorterStemmer;

	//create a sentiment analyzer instance using English language, Porter stemmer, and Senticon lexicon
	const analyzer = new Analyzer('English', stemmer, 'senticon');

	//create a word tokenizer instance for splitting text into words
	const tokenizer = new natural.WordTokenizer();

	if (textToTokenize === '') {
		const response = {
			error: 'Missing text for sentiment analysis.',
		};
		res.status(400).json(response); // Use res.json() to send JSON data
		return;
	}

	//tokenize the text (split into words)
	const tokenizedText = tokenizer.tokenize(textToTokenize);

	//get sentiment score using the natural language analyzer
	const naturalSentimentScore = analyzer.getSentiment(tokenizedText);

	//get sentiment scores using VaderSentiment
	const vaderSentimentScores = vaderSentiment.SentimentIntensityAnalyzer.polarity_scores(textToTokenize);

	//combine the scores from natural and VaderSentiment
	const combinedScore = (naturalSentimentScore + vaderSentimentScores.compound) / 2;

	//perform sentiment categorisation based on combined score
	const sentiment = categoriseSentiment(naturalSentimentScore, vaderSentimentScores.compound, combinedScore, purpose);

	res.status(200).send(JSON.stringify(sentiment)); // Send sentiment data as JSON
});

app.options('/api/getNewsByTheme', (req, res) => {
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.sendStatus(200); // Successful pre-flight response
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

app.options('/api/getNewsByDate', (req, res) => {
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.sendStatus(200); // Successful pre-flight response
});

app.post('/api/getNewsByDate', async (req, res) => {
	const { month, year } = req.body;

	try {
		const NYTimesAPI = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=`;
		const response = await fetch(NYTimesAPI + process.env.NY_TIMES_API);

		if (!response.ok) throw response;

		const incomingData = await response.json();

		const filteredArticles = incomingData.response.docs.filter(
			(article) => article.web_url && article.web_url !== 'null',
		);

		res.status(200).send(JSON.stringify(filteredArticles.slice(0, 200)));
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
});

app.options('/api/scrapeArticleData', (req, res) => {
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.sendStatus(200); // Successful pre-flight response
});

app.post('/api/scrapeArticleData', async (req, res) => {
	const articleURL = req.body.url;

	//used to scrape article data
	const playwright = require("playwright");
	const cheerio = require('cheerio');

	//reset stored news text - ensures that updated version is pulled when calling api from client
	let scrapedArticleData = {};

	try {
		//accessing the article content through playwright
		const browser = await playwright.chromium.launch();
		const context = await browser.newContext();
		const page = await context.newPage();
		await page.goto(articleURL);
		await page.waitForTimeout(1000);
		const content = await page.content();

		//retrieving the content with cheerio
		const $ = cheerio.load(content);
		const getArticle = $('article');
		scrapedArticleData = { text: getArticle.find('section').find('p.css-at9mc1').contents().text() };

		await browser.close();

		res.status(200).send(await scrapedArticleData);
	} catch (error) {
		console.log(error);
		res.status(500).end();
	}
});

app.options('/api/getCoordinates', (req, res) => {
	res.setHeader('Access-Control-Allow-Methods', 'POST');
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.sendStatus(200); // Successful pre-flight response
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

//retrieve port from .env
const PORT = process.env.PORT;

app.listen(PORT, (error) => {
	if (!error) {
		console.log(`[server]: Server is running at:\n[server]: http://localhost:${PORT}`);
	} else {
		console.log(`[server]: Server run into a problem:\n[server]: ${error}`);
	}
});

module.exports = app;
