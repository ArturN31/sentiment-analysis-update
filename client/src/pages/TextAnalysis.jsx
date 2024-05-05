import { Container } from 'react-bootstrap';
import { Stack } from 'react-bootstrap';

import InputForm from '../components/user-text/InputForm';
import SentimentAnalysis from '../components/user-text/SentimentAnalysis';

import { useState } from 'react';

const TextAnalysis = () => {
	const [textToAnalyse, setTextToAnalyse] = useState('');

	return (
		<Container fluid>
			<h1 className='text-center m-5 mb-3 text-white'>Find the emotion in your text</h1>
			<Stack gap={3} className='col-10 col-xs-10 col-md-8 col-xl-6 mx-auto'>
				<InputForm setTextToAnalyse={setTextToAnalyse} />
				<SentimentAnalysis textToAnalyse={textToAnalyse} />
			</Stack>
		</Container>
	);
};

export default TextAnalysis;
