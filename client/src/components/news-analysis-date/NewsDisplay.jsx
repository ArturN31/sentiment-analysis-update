/* eslint-disable react/prop-types */
import { Accordion, Stack, Image, Col, Row } from 'react-bootstrap';
import SentimentOutput from '../SentimentOutput';

const NewsDisplay = ({ newsData }) => {
    const { headline, pub_date, multimedia, text } = newsData;

    return (
        <Accordion flush className='col-12 col-md-10 col-xl-8 mx-auto'>
            <Accordion.Item eventKey={headline.main}>
                <Accordion.Header>
                    <div>
                        <h5>{headline.main}</h5>
                        <p className='m-0'>
                            Article release date: {pub_date.split('T')[0]} - {pub_date.split('T')[1].split('-')[0].split('+')[0]}
                        </p>
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <Stack gap={3}>
                        <Row className='d-flex flex-wrap justify-content-center gap-3'>
                            <Col className='col-12 col-md-8 col-xxl-5 d-grid justify-content-center rounded'>
                                {multimedia && multimedia.length > 0 ? (
                                    <Image fluid src={`https://www.nytimes.com/${multimedia[1].url}`} className='border border-dark border-5 rounded shadow-sm m-auto' />
                                ) : (
                                    ''
                                )}
                            </Col>

                            <Col className='rounded col-12 col-md-8 col-xxl-5 d-grid justify-content-center'>
                                <SentimentOutput sentimentResponse={newsData.sentimentAnalysis} />
                            </Col>
                        </Row>

                        <Row>
                            <Col className='rounded'>
                                <p style={{ textAlign: 'justify' }} className='rounded m-auto p-3  border border-dark border-5 shadow-sm'>{text}</p>
                            </Col>
                        </Row>
                    </Stack>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default NewsDisplay;