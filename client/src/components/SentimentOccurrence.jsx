/* eslint-disable react/prop-types */
import { useEffect, useState } from "react"
import { Stack } from 'react-bootstrap'

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
        <Stack gap={1} className="text-center text-white bg-dark p-3 col-12 col-md-10 col-xl-8 mx-auto rounded">
            <p className="m-0">Sentiment Occurrence:</p>

            <Stack gap={3} direction='horizontal' className="d-flex flex-wrap justify-content-center">
                {Object.keys(sentimentOccurence).map((sentiment, index) => <p className="m-0" key={index}>{sentiment}: {Object.values(sentimentOccurence)[index]}</p>)}
            </Stack>
        </Stack>
    )
}

export default SentimentOccurrence