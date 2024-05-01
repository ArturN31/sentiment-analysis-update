/* eslint-disable react/prop-types */
import { Row, Col, Card, Accordion, ListGroup } from 'react-bootstrap';
import SentimentOutput from '../SentimentOutput';

const NewsDisplay = (props) => {
    const { newsData } = props;
    const { headline, pub_date, multimedia, text } = newsData;

    return (
        <Row className='m-3'>
            <Col>
                <Accordion flush>
                    <Accordion.Item eventKey={headline.main}>
                        <Accordion.Header>
                            <div>
                                <h5>{headline.main}</h5>
                                <p>
                                    News date: {pub_date.split('T')[0]} - {pub_date.split('T')[1].split('-')[0]}
                                </p>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <Card>
                                <Card.Body>
                                    <ListGroup className='list-group-flush'>
                                        {multimedia.length > 0 ? (
                                            <Card.Img style={{ width: '50vw' }} className='mx-auto' src={`https://www.nytimes.com/${multimedia[0].url}`} />
                                        ) : (
                                            ''
                                        )}
                                        <Card.Body className='text-center'>
                                            <p>{text}</p>

                                            <SentimentOutput sentimentResponse={newsData.sentimentAnalysis} />

                                        </Card.Body>
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Col>
        </Row>
    );
};

export default NewsDisplay;