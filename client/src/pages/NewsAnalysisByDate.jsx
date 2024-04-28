import { Container } from 'react-bootstrap';

import SetNewsParams from '../components/news-analysis-date/SetNewsParams';

const NewsAnalysisByDate = () => {
    return (
        <Container fluid>
            <h1 className='text-center m-5 mb-3 text-white'>Analysis by date</h1>
            <SetNewsParams />
        </Container>
    );
}

export default NewsAnalysisByDate;