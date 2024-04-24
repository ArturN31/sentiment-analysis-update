import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import NewsDisplay from './NewsDisplay';

const NewsFetch = (params) => {
	const { handleMaxCountChange } = params;
	const { theme, count } = params.params;
	const [news, setNews] = useState([]);
	const [newsWithScrapedData, setNewsWithScrapedData] = useState([]);
	const [error, setError] = useState()

	useEffect(() => {
		//removes . from theme
		const prepThemeForSubmit = () => {
			if (theme.includes('.')) return theme.replace('.', '');
			return theme;
		};
		const getTheme = prepThemeForSubmit();
		const url = 'http://localhost:3001/api/getNewsByTheme';

		// Checks if response is already stored
		const storedNewsResponse = sessionStorage.getItem(`${getTheme}-newsResponse`);

		//sends theme to api - used to retrieve news
		const postParamsToAPI = async () => {
			try {
				await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ theme: getTheme }),
				});
			} catch (error) {
				console.error(error);
			}
		};

		//retrieves news based on previously passed theme
		const getNews = async () => {
			try {
				const response = await fetch(url);

				if (!response.ok) {
					throw response;
				}

				const incomingData = await response.json();

				if (incomingData && incomingData.length > 0) {
					setNews(incomingData);
					sessionStorage.setItem(`${getTheme}-newsResponse`, JSON.stringify(incomingData));
				}
			} catch (error) {
				console.error(error);
			}
		};

		const fetchData = async () => {
			if (storedNewsResponse) {
				// Getting news from storage
				setNews(JSON.parse(storedNewsResponse));
			} else {
				// Getting news from API
				try {
					await postParamsToAPI();
					await getNews();
				} catch (error) {
					console.error(error);
				}
			}
		};

		fetchData();
	}, [theme]);

	useEffect(() => {
		handleMaxCountChange(news.length);

		const apiURL = 'http://localhost:3001/api/scrapeArticleData';

		const fetchScrapedArticleText = async (article) => {
			try {
				//send article url to api that scrapes the article text
				const postResponse = await fetch(apiURL, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ url: article.url }),
				});

				if (!postResponse.ok) {
					throw new Error('Failed to send article data to the api.');
				}

				//retrieve sraped article text
				const getResponse = await fetch(apiURL);
				const data = await getResponse.json();

				//if text is available update the news array
				if (data && data.text) {
					const updatedArticle = { ...article, text: data.text };
					setNewsWithScrapedData((prevNews) => {
						if (prevNews.length > 0) {
							const updatedNews = prevNews.map((a) => (a.url === article.url ? updatedArticle : a));
							return updatedNews;
						} else {
							const updatedNews = news.map((a) => (a.url === article.url ? updatedArticle : a));
							return updatedNews;
						}
					});
				}

				//update the error state for output
				if (data && data.error) setError(data.error);
			} catch (error) {
				console.error(error);
			}
		};

		const articlesToFetch = news.slice(0, count);
		articlesToFetch.forEach(async (article) => {
			await fetchScrapedArticleText(article);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [news]);

	console.log(newsWithScrapedData)

	return (
		<>
			<Row className='d-flex justify-content-center'>
				<Col className='col-6 m-4 text-white text-center'>
					<span>Total amount of available articles: {news.length}</span>
				</Col>
			</Row>
			<Row>
				<Col>
					{newsWithScrapedData.length > 0 ? newsWithScrapedData.slice(0, count).map((n) => (
						<NewsDisplay
							newsData={n}
							error={error}
							key={n.title}
						/>
					)) : news.slice(0, count).map((n) => (
						<NewsDisplay
							newsData={n}
							error={error}
							key={n.title}
						/>
					))}
				</Col>
			</Row>
		</>
	);
};

export default NewsFetch;
