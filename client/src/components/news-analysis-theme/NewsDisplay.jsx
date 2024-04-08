/* eslint-disable react/prop-types */

import { useEffect, useState } from 'react';
import { Row, Col, Card, Accordion, ListGroup } from 'react-bootstrap';
//import NewsSentiment from './NewsSentiment';

const NewsDisplay = (props) => {
	const { newsData } = props;
	const { title, published_date, multimedia, url } = newsData;

	const [newsText, setNewsText] = useState(['']);
	const [error, setError] = useState('');

	//todo: scrape news data from urls and add it to output
	useEffect(() => {
		const apiURL = 'http://localhost:3001/api/scrapeArticleData';
		const postNewsURLtoAPI = async () => {
			await fetch(apiURL, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: url }),
			}).catch((error) => console.error(error));
		};
		postNewsURLtoAPI();

		const getNewsData = async () => {
			await fetch(apiURL)
				.then(async (response) => {
					return await response.json();
				})
				.then((data) => {
					setError(data.error)
					setNewsText(data.text)
				});
		};
		getNewsData();
	}, [url]);

	return (
		<Row className='m-3'>
			<Col>
				<Accordion flush>
					<Accordion.Item eventKey={title}>
						<Accordion.Header>
							<div>
								<h5>{title}</h5>
								<p>
									News date: {published_date.split('T')[0]} - {published_date.split('T')[1].split('-')[0]}
								</p>
							</div>
						</Accordion.Header>
						<Accordion.Body>
							<Card>
								<Card.Body>
									<ListGroup className='list-group-flush'>
										{multimedia ? (
											<Card.Img
												style={{ width: '50vw' }}
												className='mx-auto'
												src={multimedia[0].url}
											/>
										) : (
											''
										)}
										<Card.Body>
											{newsText
												? <p className='text-center'>{newsText}</p>
												: ''}

											{error ? <p>{error}</p> : ''}
										</Card.Body>
									</ListGroup>
								</Card.Body>
							</Card>
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
			</Col>
		</Row>
	);
};

export default NewsDisplay;
