/* eslint-disable react/prop-types */
import { Row, Col } from 'react-bootstrap';

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
			<Col className='text-center'>
				<h1>{prepTitle()}</h1>
				{description.map((paragraph, index) => (
					<p key={index}>{paragraph}</p>
				))}
			</Col>
		</Row>
	);
};

export default SentimentCard;
