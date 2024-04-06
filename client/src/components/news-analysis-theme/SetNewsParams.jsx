import { useState } from 'react';
import { Row, Col, Form, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import NewsFetch from './NewsFetch';

const themes = [
	'arts',
	'automobiles',
	'books/review',
	'business',
	'fashion',
	'food',
	'health',
	'home',
	'insider',
	'magazine',
	'movies',
	'ny.region',
	'obituaries',
	'opinion',
	'politics',
	'real.estate',
	'science',
	'sports',
	'sunday.review',
	'technology',
	'theater',
	't-magazine',
	'travel',
	'upshot',
	'us',
	'world',
];

// used to update the state of the params. Uses onSubmit
function SetNewsParams() {
	const [params, setParams] = useState({
		theme: 'home',
		count: 1,
	});

	const [isSubmitted, setIsSubmitted] = useState(false);

	// sets params for themes
	const handleDropdownSelection = (theme) => {
		setParams({ ...params, theme: theme });
		setIsSubmitted(false);
	};

	// sets params for count
	const handleCountChange = (e) => {
		setParams({ ...params, count: e.target.value });
		setIsSubmitted(false);
	};

	const handleSubmit = () => {
		setIsSubmitted(true);
	};

	//preps themes for output to user
	const prepListElement = (theme) => {
		if (theme.split('.')) {
			const hasTwoWords = theme.split('.');
			const hasSlash = theme.split('/');
			let firstWord = '';
			let secondWord = '';

			if (hasTwoWords.length === 2) {
				if (hasTwoWords[0] === 'ny') firstWord = hasTwoWords[0].toUpperCase();
				else firstWord = hasTwoWords[0].substr(0, 1).toUpperCase() + hasTwoWords[0].slice(1);
				secondWord = hasTwoWords[1].substr(0, 1).toUpperCase() + hasTwoWords[1].slice(1);
				return firstWord + ' ' + secondWord;
			}

			if (hasSlash.length === 2) {
				firstWord = hasSlash[0].substr(0, 1).toUpperCase() + hasSlash[0].slice(1);
				secondWord = hasSlash[1].substr(0, 1).toUpperCase() + hasSlash[1].slice(1);
				return firstWord + '/' + secondWord;
			}

			if (theme === 'us') return theme.toUpperCase();
			else return theme.substr(0, 1).toUpperCase() + theme.slice(1);
		}
	};

	return (
		<Row>
			<Col>
				<Form className='col-6 mx-auto user-input-div'>
					<Row className='text-center'>
						<Col>
							<p>First choose the theme from a drop down list, then enter the article count to be displayed.</p>
						</Col>
					</Row>
					<Row>
						<Col>
							<Form.Group controlId='f_count'>
								<Form.Label>Article Count:</Form.Label>
								<Form.Control
									type='number'
									onChange={handleCountChange}
									min='0'
									max='10'
									value={params.count}
								/>
							</Form.Group>
						</Col>
						<Col>
							<Form.Group
								controlId='f_themes'
								className='mb-4'>
								<Form.Label>Theme:</Form.Label>
								<DropdownButton
									id='dropdown-themes'
									title={prepListElement(params.theme)}
									className='btn-select'
									menuVariant='dark'
									drop='down-centered'>
									{/* maps through themes array for drop down box */}
									{themes.map((theme, index) => (
										<Dropdown.Item
											key={index}
											onClick={() => handleDropdownSelection(theme)}
											className='text-center'>
											{prepListElement(theme)}
										</Dropdown.Item>
									))}
								</DropdownButton>
							</Form.Group>
						</Col>
					</Row>
					<Row className='w'>
						<Col className='d-flex justify-content-center'>
							<Button
								onClick={() => {
									handleSubmit();
								}}>
								Sumbit
							</Button>
						</Col>
					</Row>
				</Form>
				{isSubmitted ? <NewsFetch params={params} /> : ''}
			</Col>
		</Row>
	);
}

export default SetNewsParams;
