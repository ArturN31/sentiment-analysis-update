import { Container } from 'react-bootstrap';
import SetNewsParams from '../components/news-analysis-date/SetNewsParams'

function InteractiveMap() {
    return (
        <Container fluid>
            <h1 className='text-center m-5 mb-3 text-white'>Interactive Map</h1>
            <SetNewsParams />
        </Container>
    );
}

export default InteractiveMap;