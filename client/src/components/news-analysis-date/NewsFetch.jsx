/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap"
import NewsDisplay from "./NewsDisplay";
import SentimentOccurrence from "../SentimentOccurrence";

const NewsFetch = ({ params, handleMaxCountChange }) => {
    const { month, year, count } = params;
    const [news, setNews] = useState([]);
    const [updatedNews, setUpdatedNews] = useState([]);
    const [error, setError] = useState()

    useEffect(() => {
        const fetchNewsByDate = async () => {
            try {
                const apiURL = 'http://localhost:3001/api/getNewsByDate';
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ month: month, year: year })
                }
                const response = await fetch(apiURL, options);
                if (!response.ok) throw response;
                const incomingData = await response.json();
                setNews(incomingData);
            } catch (error) { console.error(error); }
        }
        fetchNewsByDate()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        handleMaxCountChange(news.length);

        const fetchScrapedArticleText = async (article) => {
            try {
                const apiURL = 'http://localhost:3001/api/scrapeArticleData';
                const response = await fetch(apiURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: article.web_url }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send article data to the api.');
                }

                const data = await response.json();

                if (data && data.text) {
                    return { ...article, text: data.text };
                } else if (data && data.error) {
                    setError(data.error);
                }

            } catch (error) {
                console.error(error);
            }
        };

        const fetchSentimentAnalysis = async (article) => {
            if (article.text) {
                try {
                    const url = 'http://localhost:3001/api/sentimentAnalysis';
                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: article.text }),
                    });

                    if (!response.ok) {
                        throw response;
                    }

                    const sentimentData = await response.json();
                    return { ...article, sentimentAnalysis: sentimentData };
                } catch (error) {
                    console.error(error);
                }
            }
        };

        const updateNews = async () => {
            const articlesToScrapeTextFor = news.slice(0, count);

            const results = await Promise.allSettled(
                articlesToScrapeTextFor.map(async (article) => {
                    const updatedArticleWithText = await fetchScrapedArticleText(article);
                    const updatedArticleWithSentiment = await fetchSentimentAnalysis(updatedArticleWithText);
                    return updatedArticleWithSentiment
                })
            );

            // Filter successful updates from the results (excluding undefined)
            const updatedNews = results.filter((result) => result.status === 'fulfilled' && result.value)
                .map((result) => result.value);

            setUpdatedNews(updatedNews);
        };
        updateNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [news])

    return (
        <>
            <Row className='d-flex justify-content-center'>
                <Col className='col-6 m-4 text-white text-center'>
                    <span>Total amount of available articles: {news.length}</span>
                </Col>
            </Row>
            <Row>
                <Col>
                    <SentimentOccurrence updatedNews={updatedNews} />
                </Col>
            </Row>
            <Row>
                <Col>
                    {updatedNews.length > 0 ? updatedNews.slice(0, count).map((n) => (
                        <NewsDisplay
                            newsData={n}
                            error={error}
                            key={n.headline.main}
                        />
                    )) : ''}
                </Col>
            </Row>
        </>
    )
}

export default NewsFetch;