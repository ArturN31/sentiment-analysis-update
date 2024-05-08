import { useEffect, useState } from 'react';
import SentimentCard from './SentimentCard';

/* eslint-disable react/prop-types */
const SentimentOutput = ({ sentimentResponse }) => {
	const { description, sentiment } = sentimentResponse;
	const [style, setStyle] = useState({});

	const sentimentStyles = new Map([
		['very positive', { background: 'linear-gradient(45deg, #ffcc00, #ff3300)', color: '#000' }],
		['positive', { background: 'linear-gradient(45deg, #66cc33, #ffcc00)', color: '#000' }],
		['slightly positive', { background: 'linear-gradient(45deg, #99ff99, #66cc33)', color: '#000' }],
		['neutral', { background: 'linear-gradient(45deg, #cccccc, #999999)', color: '#000' }],
		['slightly negative', { background: 'linear-gradient(45deg, #ffcc99, #ff9933)', color: '#fff' }],
		['negative', { background: 'linear-gradient(45deg, #ff6666, #cc0000)', color: '#fff' }],
		['very negative', { background: 'linear-gradient(45deg, #990000, #660000)', color: '#fff' }],
		['undefined', 'none'],
	]);

	const sentimentStyling = () => {
		const backgroundStyle = sentimentStyles.get(sentiment) || {};
		setStyle(backgroundStyle);
	};

	useEffect(() => {
		sentimentStyling();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return sentimentResponse.sentiment ? (
		<div style={style} className='p-3 rounded'>
			<SentimentCard description={description} sentiment={sentiment} />
		</div>
	) : (
		''
	);
};

export default SentimentOutput;