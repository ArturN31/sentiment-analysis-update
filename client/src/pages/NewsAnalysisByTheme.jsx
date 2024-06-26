import SetNewsParams from '../components/news-analysis-theme/SetNewsParams';

import { Container } from 'react-bootstrap';

const NewsAnalysisTheme = () => {
	return (
		<Container fluid>
			<h1 className='text-center m-5 mb-3 text-white'>News Analysis by Theme</h1>
			<SetNewsParams />
		</Container>
	);
};

export default NewsAnalysisTheme;
