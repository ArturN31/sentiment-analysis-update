import { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import NewsDisplay from './NewsDisplay';

const NewsFetch = (params) => {
	const { handleMaxCountChange } = params;
	const { theme, count } = params.params;
	const [news, setNews] = useState([]);

	useEffect(() => {
		//removes . from theme
		const prepThemeForSubmit = () => {
			if (theme.includes('.')) return theme.replace('.', '');
			return theme;
		};
		const getTheme = prepThemeForSubmit();
		const url = 'http://localhost:3001/api/getNewsByTheme';

		// Checks if response is already stored
		const storedNewsResponse = localStorage.getItem(`${getTheme}-newsResponse`);

		if (storedNewsResponse) {
			//getting news from storage
			setNews(JSON.parse(storedNewsResponse));
		} else {
			//getting news from api

			//sends theme to api - used to retrieve news
			const postParamsToAPI = async () => {
				await fetch(url, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ theme: getTheme }),
				}).catch((error) => console.error(error));
			};
			postParamsToAPI();

			//retrieves news based on previously passed theme
			const getNews = async () => {
				await fetch(url)
					.then(async (response) => {
						if (!response.ok) {
							throw response;
						}
						return await response.json();
					})
					.then(async (incomingData) => {
						setNews(await incomingData);
						localStorage.setItem(`${getTheme}-newsResponse`, JSON.stringify(incomingData));
					})
					.catch((error) => console.error(error));
			};
			getNews();
		}
	}, [theme]);

	useEffect(() => {
		handleMaxCountChange(news.length);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [news]);

	console.log(news);
	//todo: add news display

	return (
		<>
			<Row className='d-flex justify-content-center'>
				<Col className='col-6 m-4 text-white text-center'>
					<span>Total amount of available articles: {news.length}</span>
				</Col>
			</Row>
			<Row>
				<Col>
					{news.slice(0, count).map((n) => (
						<NewsDisplay
							newsData={n}
							key={n.title}
						/>
					))}
				</Col>
			</Row>
		</>
	);
};

export default NewsFetch;
