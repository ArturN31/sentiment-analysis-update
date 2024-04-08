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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [news]);

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
