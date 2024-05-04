/* eslint-disable react/prop-types */
import 'leaflet/dist/leaflet.css'
import { Marker, Popup } from "react-leaflet"
import { Row, Col, Container } from "react-bootstrap"
import SentimentOutput from '../SentimentOutput'

const ArticleMarkers = ({ newsWithCoords }) => {
    const usedCoordinates = []; // Array to store used coordinates

    const getArticleCoordinates = (article) => {
        const coordinates = article.coordinates ? [parseFloat(article.coordinates.latitude), parseFloat(article.coordinates.longitude)] : [];
        if (usedCoordinates.find((used) => used.every((coord, i) => Math.abs(coord - coordinates[i]) < 0.001))) {
            coordinates[0] += 1; // Offset latitude slightly for coordinates in the same area
        }
        usedCoordinates.push(coordinates);
        return coordinates;
    };

    console.log(newsWithCoords)

    const markers = newsWithCoords && newsWithCoords.map((article, index) => (
        <Marker key={index} position={getArticleCoordinates(article)}>
            <Popup>
                <Container className='px-1 py-3'>
                    <div className='mb-2'>
                        <Row>
                            <Col>
                                <h5 className="mb-2 text-center p-2 border rounded bg-body-secondary">{article.headline.main}</h5>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                {article.abstract ? (
                                    <p className='m-0 text-center p-2 border rounded bg-body-tertiary'>{article.abstract}</p>
                                ) : ''}
                            </Col>
                        </Row>
                    </div>

                    <Row>
                        <Col className='d-flex justify-content-center'>
                            {article.multimedia && article.multimedia.length > 0 && article.multimedia[0].url ? (
                                <img
                                    className='w-100 rounded border object-fit-cover'
                                    src={`https://www.nytimes.com/${article.multimedia[0].url}`}
                                    alt={`Image for article: ${article.headline.print_headline}`}
                                />
                            ) : ''}
                        </Col>

                        <Col className='d-flex m-auto'>
                            <SentimentOutput sentimentResponse={article.sentimentAnalysis} />
                        </Col>
                    </Row>
                </Container>
            </Popup>
        </Marker>
    ));

    return markers;

}

export default ArticleMarkers;