/* eslint-disable react/prop-types */

import { Row, Col, Card, Accordion, ListGroup } from 'react-bootstrap';

import SentimentOutput from '../SentimentOutput';

const NewsDisplay = (props) => {
	const { newsData, error } = props;
	const { title, published_date, multimedia, text } = newsData;

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
											<Card.Img style={{ width: '50vw' }} className='mx-auto' src={multimedia[0].url} />
										) : (
											''
										)}
										<Card.Body className='text-center'>
											<p>{text}</p>

											<SentimentOutput sentimentResponse={newsData.sentimentAnalysis} />

											<p>{error}</p>
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