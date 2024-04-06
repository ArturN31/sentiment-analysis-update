/* eslint-disable react/prop-types */
import { Row } from 'react-bootstrap';
//import image from './images/annoyed-face.png';

const SentimentCard = ({ sentiment, description }) => {
	const prepTitle = () => {
		let title = '';
		if (sentiment.split(' ')) {
			const isMoreThanOneWord = sentiment.split(' ');

			if (isMoreThanOneWord.length === 2) {
				const firstWord = isMoreThanOneWord[0].substr(0, 1).toUpperCase() + isMoreThanOneWord[0].slice(1);
				const secondWord = isMoreThanOneWord[1].substr(0, 1).toUpperCase() + isMoreThanOneWord[1].slice(1);
				title = firstWord + ' ' + secondWord;
			} else {
				title = sentiment.substr(0, 1).toUpperCase() + sentiment.slice(1);
			}

			return title;
		}
	};

	return (
		<Row>
			<h1>{prepTitle()}</h1>
			{description.map((paragraph, index) => (
				<p key={index}>{paragraph}</p>
			))}
		</Row>
	);
};

export default SentimentCard;
