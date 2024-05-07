/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap"
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from 'react-leaflet'
import ArticleMarkers from "./ArticleMarkers";


const InteractiveMap = ({ news }) => {
    const [newsWithCoords, setNewsWithCoords] = useState();
    const [userCoords, setUserCoords] = useState();

    useEffect(() => {
        const getNewsCoordinates = async (geolocation) => {
            try {
                const apiURL = 'https://sentiment-analysis-server.vercel.app/api/getCoordinates';
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ geolocation }),
                };
                const response = await fetch(apiURL, options);

                if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

                const coordinates = await response.json();
                return coordinates; // Return the coordinates for later use
            } catch (error) {
                console.error('Error retrieving coordinates:', error);
                return null; // Return null for error handling (optional)
            }
        }

        const handleNewsKeywords = async () => {
            if (!news || !news.length) return; // Handle empty news array gracefully

            const articlesWithCoordinates = [];
            for (const article of news) {
                const glocationKeyword = article.keywords.find(keyword => keyword.name.toLowerCase() === "glocations");
                if (glocationKeyword) {
                    try {
                        const coordinates = await getNewsCoordinates(glocationKeyword.value);
                        if (coordinates) { // Check for potential errors
                            articlesWithCoordinates.push({ ...article, coordinates }); // Add coordinates to the article object
                        }
                    } catch (error) {
                        console.error('Error retrieving coordinates for keyword:', glocationKeyword.value, error);
                    }
                }
            }
            setNewsWithCoords(articlesWithCoordinates);
        };

        handleNewsKeywords()
        navigator.geolocation.getCurrentPosition((position) => setUserCoords([position.coords.latitude, position.coords.longitude]))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Row className="d-flex justify-content-center">
            <Col className="col-12 col-xl-8 col-2xl-6 m-5 bg-dark p-2 rounded-2">
                {userCoords ? <MapContainer center={userCoords} zoom={2} scrollWheelZoom={true} style={{ height: "50dvh" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <ArticleMarkers newsWithCoords={newsWithCoords} />
                </MapContainer> : ''}
            </Col>
        </Row>
    )
}

export default InteractiveMap;