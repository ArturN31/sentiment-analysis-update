/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const InputForm = ({ setTextToAnalyse }) => {
	const [textareaInput, setTextareaInput] = useState('');

	const textAreaRef = useRef(null);

	//resizing the textarea to fit content
	const resize_text_area = () => {
		textAreaRef.current.style.height = 'auto';
		textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
	};

	const text_area_reset = () => {
		document.getElementById('textarea').value = '';
		document.getElementById('sentiment-output').innerHTML = '';
		document.getElementById('sentiment-output').style = '';
		document.getElementById('sentiment-output').classList = '';
		resize_text_area();
		setTextToAnalyse('');
	};

	const text_area_submit = () => {
		setTextToAnalyse('');
		setTextToAnalyse({ text: textareaInput });
	};

	useEffect(() => {
		resize_text_area();
	}, [textareaInput]);

	return (
		<>
			<div className='user-input-div'>
				<Form>
					<Form.Group
						className='mb-4'
						controlId='textarea'>
						<Form.Label className='h1 d-flex justify-content-center'>Enter your Text </Form.Label>
						<p className='text-center'>
							Please submit text in the form of single sentences or even entire paragraphs, and sentiment analysis will
							be performed to determine the conveyed emotion.
						</p>
						<Form.Control
							as='textarea'
							rows={10}
							ref={textAreaRef}
							value={textareaInput}
							onChange={(e) => setTextareaInput(e.target.value)}
						/>
					</Form.Group>
				</Form>
				<div className='d-flex justify-content-end'>
					<Button
						className='mx-2 btn-reset'
						onClick={text_area_reset}>
						Reset
					</Button>
					<Button
						className='mx-2'
						onClick={() => {
							text_area_submit();
						}}>
						Analyse text
					</Button>
				</div>
			</div>
		</>
	);
};

export default InputForm;
