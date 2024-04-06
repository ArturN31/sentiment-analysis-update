import { Container } from 'react-bootstrap';
import { Row, Col } from 'react-bootstrap';

import InputForm from '../components/user-text/InputForm';
import SentimentAnalysis from '../components/SentimentAnalysis';

import { useState } from 'react';

const TextAnalysis = () => {
	const [textToAnalyse, setTextToAnalyse] = useState('');

	return (
		<Container fluid>
			<h1 className='text-center m-5 mb-3 text-white'>Find the emotion in your text</h1>
			<>
				<Row className='mx-5'>
					<Col className='col-xs-12 col-md-10 col-xl-6 mx-auto'>
						<InputForm setTextToAnalyse={setTextToAnalyse} />
					</Col>
				</Row>
				<Row className='m-5 text-center'>
					<Col>
						<SentimentAnalysis textToAnalyse={textToAnalyse} />
					</Col>
				</Row>
			</>
		</Container>
	);
};

export default TextAnalysis;
