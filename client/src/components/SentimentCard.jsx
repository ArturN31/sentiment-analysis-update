/* eslint-disable react/prop-types */
import { Stack } from 'react-bootstrap';

const SentimentCard = ({ sentiment, description }) => {
	const prepTitle = () => {
		let title = '';

		//if the sentiment string contains any words (separated by spaces)
		if (sentiment.split(' ')) {
			const words = sentiment.split(' '); //split the sentiment string into an array of words

			//if there are two words in the sentiment
			if (words.length === 2) {
				//capitalise the first letter of the first and second word
				const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
				const secondWord = words[1].charAt(0).toUpperCase() + words[1].slice(1);

				title = firstWord + ' ' + secondWord;
			} else {
				//if there's only one word
				//capitalise the first letter and store it in the title
				title = sentiment.charAt(0).toUpperCase() + sentiment.slice(1);
			}
		}
		return title;
	};

	return (
		<Stack gap={1} className='text-center'>
			<h1 className='m-0'>{prepTitle()}</h1>
			{description.map((paragraph, index) => (
				<p className='m-0' key={index}>{paragraph}</p>
			))}
		</Stack>
	);
};

export default SentimentCard;
