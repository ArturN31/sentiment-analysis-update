/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Row, Col } from 'react-bootstrap'

const SentimentOccurrence = ({ updatedNews }) => {
    const [sentimentOccurence, setSentimentOccurrence] = useState([]);

    useEffect(() => {
        function countSentimentOccurrences(sentimentArray) {
            const sentimentCounts = sentimentArray.reduce((acc, sentiment) => {
                acc[sentiment] = (acc[sentiment] || 0) + 1;
                return acc;
            }, {});

            return sentimentCounts;
        }

        const handleSentimentOccurence = () => {
            if (updatedNews.length > 0) {
                const sentimentArray = updatedNews.map((article) => { return article.sentimentAnalysis.sentiment })
                setSentimentOccurrence(countSentimentOccurrences(sentimentArray))
            }
        }
        handleSentimentOccurence()
    }, [updatedNews])

    return (
        <Row className="text-center text-white bg-dark mx-4 rounded-4 pt-4 pb-2">
            <p>Sentiment Occurrence:</p>

            {Object.keys(sentimentOccurence).map((sentiment, index) => <Col key={index}><p>{sentiment}: {Object.values(sentimentOccurence)[index]}</p></Col>)}

        </Row>
    )
}

export default SentimentOccurrence