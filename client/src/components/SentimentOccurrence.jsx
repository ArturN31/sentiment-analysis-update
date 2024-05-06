/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Row, Stack } from 'react-bootstrap'

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
        <Row className="text-center text-white bg-dark mx-4 pt-4 pb-2 col-12 col-md-10 col-xl-8 mx-auto" style={{ borderRadius: '23px' }}>
            <p>Sentiment Occurrence:</p>

            <Stack gap={3} direction='horizontal' className="d-flex flex-wrap justify-content-center">
                {Object.keys(sentimentOccurence).map((sentiment, index) => <p key={index}>{sentiment}: {Object.values(sentimentOccurence)[index]}</p>)}
            </Stack>
        </Row>
    )
}

export default SentimentOccurrence