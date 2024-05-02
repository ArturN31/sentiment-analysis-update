/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

const InteractiveMap = ({ news }) => {
    const [newsWithCoords, setNewsWithCoords] = useState();

    useEffect(() => {
        const getNewsCoordinates = async (geolocation) => {
            try {
                const apiURL = 'http://localhost:3001/api/getCoordinates';
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    console.log(newsWithCoords);

    return <p className="text-center">Interactive Map</p>
}

export default InteractiveMap;