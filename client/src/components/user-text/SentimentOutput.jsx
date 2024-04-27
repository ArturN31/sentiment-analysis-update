import { useEffect, useState } from 'react';
import SentimentCard from './SentimentCard';

/* eslint-disable react/prop-types */
const SentimentOutput = ({ sentimentResponse }) => {
	const { description, sentiment } = sentimentResponse;

	const [style, setStyle] = useState({});

	const sentimentStyling = () => {
		if (sentiment === 'very positive')
			setStyle({
				background: 'linear-gradient(45deg, #ffcc00, #ff3300)',
			});

		if (sentiment === 'positive')
			setStyle({
				background: 'linear-gradient(45deg, #66cc33, #ffcc00)',
			});

		if (sentiment === 'slightly positive')
			setStyle({
				background: 'linear-gradient(45deg, #66cc99, #66cc33)',
			});

		if (sentiment === 'neutral')
			setStyle({
				background: 'linear-gradient(45deg, #cccccc, #999999)',
			});

		if (sentiment === 'slightly negative')
			setStyle({
				background: 'linear-gradient(45deg, #999999, #666666)',
			});

		if (sentiment === 'negative')
			setStyle({
				background: 'linear-gradient(45deg, #ff6666, #cc0000)',
			});

		if (sentiment === 'very negative')
			setStyle({
				background: 'linear-gradient(45deg, #990000, #660000)',
			});
	};

	useEffect(() => {
		sentimentStyling();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return sentimentResponse.sentiment ? (
		<div
			style={style}
			className='m-4 emotion-div'
			id='sentiment-output'>
			<SentimentCard
				description={description}
				sentiment={sentiment}
			/>
		</div>
	) : (
		''
	);
};

export default SentimentOutput;
