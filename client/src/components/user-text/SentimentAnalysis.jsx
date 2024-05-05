/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';

import SentimentOutput from '../SentimentOutput';

const SentimentAnalysis = ({ textToAnalyse }) => {
	const [sentimentResponse, setSentimentResponse] = useState({});

	useEffect(() => {
		setSentimentResponse('');
		if (textToAnalyse) {
			const fetchResponse = async () => {
				if (textToAnalyse.text) {
					const url = 'http://localhost:3001/api/sentimentAnalysis';
					const response = await fetch(url, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(textToAnalyse),
					}).catch((error) => console.error(error));

					if (!response.ok) {
						throw response;
					}

					const incomingData = await response.json();

					setSentimentResponse(incomingData);
				}
			};
			fetchResponse();
		}
	}, [textToAnalyse]);

	return (
		sentimentResponse ? (
			<>
				<SentimentOutput sentimentResponse={sentimentResponse} />
			</>
		) : (
			''
		)
	);
};

export default SentimentAnalysis;
