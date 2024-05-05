import { Container, Row, Col, Stack } from 'react-bootstrap';

const Homepage = () => {
	// eslint-disable-next-line react/prop-types
	const Quote = ({ quote, author }) => {
		return (
			<Row>
				<Col className='col-10 col-md-8 mx-auto'>
					<blockquote className='text-bg-dark rounded p-3 text-break' style={{ textAlign: 'justify' }}>
						{quote}
						{author}
					</blockquote>
				</Col>
			</Row>
		)
	}

	return (
		<Container fluid>
			<Row>
				<Col>
					<h1 className='text-center m-5 mb-3 text-white'>Sentiment and emotion analysis</h1>
				</Col>
			</Row>

			<Quote quote={
				<p>
					&quot;<strong>Sentiment analysis</strong> uses machine learning models to perform text analysis of
					human language. The metrics used are designed to detect whether the overall sentiment of a piece of
					text is positive, negative or neutral.&quot;
				</p>
			} author={<footer className='blockquote-footer'><cite>(Barney, 2023)</cite></footer>} />

			<Quote quote={
				<p>
					&quot;<strong>Emotion analysis</strong> identifies emotions rather than positivity and negativity.
					Examples include happiness, frustration, shock, anger and sadness.&quot;
				</p>
			} author={<footer className='blockquote-footer'><cite>(Barney, 2023)</cite></footer>} />

			<Quote quote={
				<p>
					&quot;<strong>Removes human bias through consistent analysis.</strong> Sentiment can be highly
					subjective. As humans we use tone, context, and language to convey meaning. How we understand that
					meaning depends on our own experiences and unconscious biases. &quot;
				</p>
			} author={<footer className='blockquote-footer'><cite>(Thematic, n.d.)</cite></footer>} />

			<Quote quote={
				<Stack gap={2}>
					<p style={{ textAlign: 'center' }}>
						Barney, N. (2023). sentiment analysis (opinion mining). [online] Business Analytics. Available at:
						https://www.techtarget.com/searchbusinessanalytics/definition/opinion-mining-sentiment-mining#:~:text=Sentiment%20analysis%2C%20also%20referred%20to,a%20product%2C%20service%20or%20idea.
						[Accessed 23 Mar. 2023].
					</p>
					<p style={{ textAlign: 'center' }}>
						Thematic (n.d.). Sentiment Analysis | Comprehensive Beginners Guide | Thematic | Thematic. [online]
						Getthematic.com. Available at: https://getthematic.com/sentiment-analysis/ [Accessed 23 Mar. 2023].
					</p>
				</Stack>
			} />
		</Container>
	);
};

export default Homepage;
