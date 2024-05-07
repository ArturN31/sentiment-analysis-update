/* eslint-disable react/prop-types */
import 'leaflet/dist/leaflet.css'
import { Marker, Popup } from "react-leaflet"
import { Stack, Row, Col } from "react-bootstrap"
import SentimentOutput from '../SentimentOutput'
import { Icon } from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"

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

    const markers = newsWithCoords && newsWithCoords.map((article, index) => (
        <Marker key={index} position={getArticleCoordinates(article)} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
            <Popup>
                <Stack gap={3} className='py-2'>
                    <Stack gap={3}>
                        <h5 className="text-center p-2 border rounded bg-body-secondary m-0">{article.headline.main}</h5>

                        {article.abstract ? (
                            <p className='text-center p-2 border rounded bg-body-tertiary m-0'>{article.abstract}</p>
                        ) : ''}
                    </Stack>

                    <Row>
                        <Col className='d-flex justify-content-center'>
                            {article.multimedia && article.multimedia.length > 0 && article.multimedia[0].url ? (
                                <img
                                    className='w-100 rounded-5 border object-fit-cover'
                                    src={`https://www.nytimes.com/${article.multimedia[0].url}`}
                                    alt={`Image for article: ${article.headline.print_headline}`}
                                />
                            ) : ''}
                        </Col>

                        <Col className='d-flex m-auto'>
                            <SentimentOutput sentimentResponse={article.sentimentAnalysis} />
                        </Col>
                    </Row>
                </Stack>
            </Popup>
        </Marker>
    ));

    return markers;

}

export default ArticleMarkers;