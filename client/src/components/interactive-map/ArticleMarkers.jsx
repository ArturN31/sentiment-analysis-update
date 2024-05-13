/* eslint-disable react/prop-types */
import 'leaflet/dist/leaflet.css'
import { Marker, Popup } from "react-leaflet"
import { Icon } from 'leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Stack, Image } from "react-bootstrap"
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

    const markers = newsWithCoords && newsWithCoords.map((article, index) => (
        <Marker key={index} position={getArticleCoordinates(article)} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
            <Popup>
                <Stack gap={1} className='py-2'>
                    <Stack gap={1}>
                        <h5 className="text-center p-2 bg-body-secondary m-0 border border-5 border-dark rounded">{article.headline.main}</h5>

                        <p className='text-center p-2 bg-body-tertiary m-0 border border-5 border-dark rounded'>
                            Article release date: {article.pub_date.split('T')[0]} - {article.pub_date.split('T')[1].split('-')[0].split('+')[0]}
                        </p>

                        {article.abstract ? (
                            <p className='text-center p-2 bg-body-tertiary m-0 border border-5 border-dark rounded'>{article.abstract}</p>
                        ) : ''}

                        {article.multimedia && article.multimedia.length > 0 && article.multimedia[0].url ? (
                            <Image
                                fluid
                                className='border border-dark border-5 rounded shadow-sm h-100 object-fit-cover'
                                src={`https://www.nytimes.com/${article.multimedia[0].url}`}
                                alt={`Image for article: ${article.headline.print_headline}`}
                            />
                        ) : ''}

                        <SentimentOutput sentimentResponse={article.sentimentAnalysis} />
                    </Stack>
                </Stack>
            </Popup>
        </Marker>
    ));

    return markers;
}

export default ArticleMarkers;