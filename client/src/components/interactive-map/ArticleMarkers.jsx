/* eslint-disable react/prop-types */
import 'leaflet/dist/leaflet.css'
import { Marker, Popup } from "react-leaflet"
import { Row, Col } from "react-bootstrap"

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
        <Marker key={index} position={getArticleCoordinates(article)}>
            <Popup>
                <Row>
                    <Col className="col-12">
                        <h5 className="tooltip-text">{article.headline.main}</h5>
                    </Col>
                    {article.multimedia && article.multimedia.length > 0 && article.multimedia[0].url ? <Col className="col-12 d-flex justify-content-center">
                        <img
                            style={{ width: "inherit", margin: "auto" }}
                            className='w-50'
                            src={`https://www.nytimes.com/${article.multimedia[0].url}`}
                            alt={`Image for article: ${article.headline.print_headline}`}
                        />
                    </Col> : ''}
                </Row>
            </Popup>
        </Marker>
    ));

    return markers;

}

export default ArticleMarkers;