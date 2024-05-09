import { useState } from 'react';
import { Stack, Form, Button } from 'react-bootstrap';

import NewsFetch from './NewsFetch';
import DatePicker from 'react-datepicker';


function SetNewsParams() {
	const [params, setParams] = useState({
		year: 2024,
		month: 1,
		count: 1,
		maxCount: 1,
	});

	const [date, setDate] = useState(new Date());

	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleDateChange = (date) => {
		setDate(date);
		setParams({ ...params, year: date.getFullYear(), month: date.getMonth() + 1 });
		setIsSubmitted(false);
	};

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

	return (
		<Stack gap={3}>
			<Form
				className='col-8 col-md-6 col-xl-4 mx-auto bg-white rounded p-4'
				style={{ boxShadow: '0px 4px 12px #00000050' }}>
				<Stack gap={3}>
					<p className='text-center'>
						Choose your desired date from the calendar below and enter the number of articles to display.
					</p>

					<Stack
						direction='horizontal'
						gap={3}
						className='mx-auto d-flex flex-wrap justify-content-center'>
						<Form.Group controlId='f_count'
							className='d-grid justify-content-center'>
							<Form.Label className='text-center'>Article Count:</Form.Label>
							<Form.Control
								type='number'
								onChange={handleCountChange}
								min='1'
								max={params.maxCount === 1 ? 20 : params.maxCount}
								value={params.count}
							/>
						</Form.Group>

						<Form.Group controlId='f_date' className='d-grid justify-content-center'>
							<Form.Label className='text-center'>Article Date:</Form.Label>
							<DatePicker
								id='f_date'
								selected={date}
								onChange={(date) => { handleDateChange(date) }}
								dateFormat="MM/yyyy"
								minDate={new Date('01-01-1852')}
								maxDate={new Date()}
								showMonthYearPicker
							/>
						</Form.Group>
					</Stack>

					<Form.Group
						className='d-grid justify-content-center'>
						<Button
							className='mx-auto'
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
