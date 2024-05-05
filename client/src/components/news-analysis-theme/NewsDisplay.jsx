/* eslint-disable react/prop-types */

import { Card, Accordion, Stack } from 'react-bootstrap';

import SentimentOutput from '../SentimentOutput';

const NewsDisplay = ({ newsData, error }) => {
	const { title, published_date, multimedia, text } = newsData;

	return (
		<Accordion flush className='col-12 col-md-10 col-xl-8 mx-auto'>
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
							<Stack gap={3}>
								{multimedia ? (
									<Card.Img style={{ width: '100%' }} className='d-flex mx-auto' src={multimedia[0].url} />
								) : (
									''
								)}

								<p style={{ textAlign: 'justify' }}>{text}</p>

								<SentimentOutput sentimentResponse={newsData.sentimentAnalysis} />

								{error ? <p>{error}</p> : ''}
							</Stack>
						</Card.Body>
					</Card>
				</Accordion.Body>
			</Accordion.Item>
		</Accordion>
	);
};

export default NewsDisplay;