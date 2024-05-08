import { useState } from 'react';
import { Stack, Form, DropdownButton, Dropdown, Button } from 'react-bootstrap';
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
		maxCount: 1,
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

	// sets params for count
	const handleMaxCountChange = (passedMaxCount) => {
		setParams({ ...params, maxCount: passedMaxCount });
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
		<Stack gap={3}>
			<Form
				className='col-8 col-md-6 col-xl-4 mx-auto bg-white rounded p-4'
				style={{ boxShadow: '0px 4px 12px #00000050' }}>
				<Stack gap={3}>
					<p className='text-center'>
						Choose a theme from the dropdown list and enter the number of articles you want to see.
					</p>

					<Stack
						direction='horizontal'
						gap={3}
						className='mx-auto d-flex flex-wrap justify-content-center'>
						<Form.Group controlId='f_count'>
							<Form.Label>Article Count:</Form.Label>
							<Form.Control
								type='number'
								onChange={handleCountChange}
								min='1'
								max={params.maxCount === 1 ? 20 : params.maxCount}
								value={params.count}
							/>
						</Form.Group>

						<Form.Group controlId='f_themes'>
							<Form.Label>Theme:</Form.Label>
							<DropdownButton
								id='dropdown-autoclose-true'
								title={prepListElement(params.theme)}
								variant='secondary'
								menuVariant='dark'
								drop='down-centered'>
								{/* maps through themes array for drop down box */}
								<div
									style={{
										height: '200px',
										overflowY: 'scroll',
									}}>
									{themes.map((theme, index) => (
										<Dropdown.Item
											key={index}
											onClick={() => handleDropdownSelection(theme)}
											className='text-center'>
											{prepListElement(theme)}
										</Dropdown.Item>
									))}
								</div>
							</DropdownButton>
						</Form.Group>
					</Stack>

					<Form.Group
						controlId='f_submit'
						className='mx-auto'>
						<Button
							onClick={() => {
								handleSubmit();
							}}>
							Sumbit
						</Button>
					</Form.Group>
				</Stack>
			</Form>

			{isSubmitted ? (
				<NewsFetch
					params={params}
					handleMaxCountChange={handleMaxCountChange}
				/>
			) : (
				''
			)}
		</Stack>
	);
}

export default SetNewsParams;
