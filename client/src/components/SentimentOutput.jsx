import { useEffect, useState } from 'react';
import SentimentCard from './SentimentCard';

/* eslint-disable react/prop-types */
const SentimentOutput = ({ sentimentResponse }) => {
	const { description, sentiment } = sentimentResponse;
	const [style, setStyle] = useState({});

	const sentimentStyles = new Map([
		['very positive', 'linear-gradient(45deg, #ffcc00, #ff3300)'],
		['positive', 'linear-gradient(45deg, #66cc33, #ffcc00)'],
		['slightly positive', 'linear-gradient(45deg, #99ff99, #66cc33)'],
		['neutral', 'linear-gradient(45deg, #cccccc, #999999)'],
		['slightly negative', 'linear-gradient(45deg, #ffcc99, #ff9933)'],
		['negative', 'linear-gradient(45deg, #ff6666, #cc0000)'],
		['very negative', 'linear-gradient(45deg, #990000, #660000)'],
		['undefined', 'none'], // Default style for undefined sentiment
	]);

	const sentimentStyling = () => {
		const backgroundStyle = sentimentStyles.get(sentiment) || 'none';
		setStyle({ background: backgroundStyle });
	};

	useEffect(() => {
		sentimentStyling();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return sentimentResponse.sentiment ? (
		<div style={style} className='p-5 rounded-5'>
			<SentimentCard description={description} sentiment={sentiment} />
		</div>
	) : (
		''
	);
};

export default SentimentOutput;