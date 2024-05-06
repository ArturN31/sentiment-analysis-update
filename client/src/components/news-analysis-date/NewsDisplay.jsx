/* eslint-disable react/prop-types */
import { Stack, Card, Accordion } from 'react-bootstrap';
import SentimentOutput from '../SentimentOutput';

const NewsDisplay = ({ newsData }) => {
    const { headline, pub_date, multimedia, text } = newsData;

    return (
        <Accordion flush className='col-12 col-md-10 col-xl-8 mx-auto'>
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
                            <Stack gap={3}>
                                {multimedia.length > 0 ? (
                                    <Card.Img style={{ width: '50vw' }} className='mx-auto' src={`https://www.nytimes.com/${multimedia[0].url}`} />
                                ) : (
                                    ''
                                )}

                                <p style={{ textAlign: 'justify' }}>{text}</p>

                                <SentimentOutput sentimentResponse={newsData.sentimentAnalysis} />
                            </Stack>
                        </Card.Body>
                    </Card>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
};

export default NewsDisplay;