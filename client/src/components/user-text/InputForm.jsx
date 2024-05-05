/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { Form, Button, Stack } from 'react-bootstrap';

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
		<Form className='px-5 py-3 bg-white rounded-5' style={{ boxShadow: '0px 4px 12px #00000050' }}>
			<Form.Group
				controlId='textarea'>
				<Form.Label className='h1 d-flex justify-content-center'>Enter your Text </Form.Label>
				<p className='text-center'>
					Please submit text in the form of single sentences or even entire paragraphs, and sentiment analysis will
					be performed to determine the conveyed emotion.
				</p>
				<Form.Control
					as='textarea'
					rows={6}
					ref={textAreaRef}
					value={textareaInput}
					onChange={(e) => setTextareaInput(e.target.value)}
				/>
			</Form.Group>
			<Form.Group className='pt-3'>
				<Stack direction="horizontal" gap={3}>
					<Button className='ms-auto'
						onClick={text_area_reset} style={{ background: '#FF000095' }}>
						<span>Reset</span>
					</Button>
					<Button
						onClick={() => {
							text_area_submit();
						}}>
						<span>Analyse text</span>
					</Button>
				</Stack>
			</Form.Group>
		</Form>
	);
};

export default InputForm;
