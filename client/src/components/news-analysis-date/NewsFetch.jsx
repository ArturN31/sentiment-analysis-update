/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Stack } from 'react-bootstrap';
import NewsDisplay from './NewsDisplay';
import SentimentOccurrence from '../SentimentOccurrence';
import InteractiveMap from '../interactive-map/InteractiveMap';

const NewsFetch = ({ params, handleMaxCountChange }) => {
    const { month, year, count } = params;
    const [news, setNews] = useState([]);
    const [updatedNews, setUpdatedNews] = useState([]);
    const [error, setError] = useState();

    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        setCurrentPage(document.URL.split('/').pop());

        const fetchNewsByDate = async () => {
            try {
                const apiURL = 'https://sentiment-analysis-server.vercel.app/api/getNewsByDate';
                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ month: month, year: year }),
                };
                const response = await fetch(apiURL, options);
                if (!response.ok) throw response;
                const incomingData = await response.json();
                setNews(incomingData);
            } catch (error) {
                console.error(error);
            }
        };
        fetchNewsByDate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        handleMaxCountChange(news.length);

        const fetchScrapedArticleText = async (article) => {
            try {
                const apiURL = 'https://sentiment-analysis-server.vercel.app/api/scrapeArticleData';
                const response = await fetch(apiURL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: article.web_url }),
                });

                if (!response.ok) {
                    throw new Error('Failed to send article data to the api.');
                }

                const data = await response.json();

                if (data.text) {
                    return { ...article, text: data.text };
                } else if (data.error) {
                    setError(data.error);
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchSentimentAnalysis = async (article) => {
            if (article.text) {
                try {
                    const url = 'https://sentiment-analysis-server.vercel.app/api/sentimentAnalysis';
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

        const fetchNewsData = async (articles) => {
            const results = await Promise.allSettled(
                articles.map(async (article) => {
                    try {
                        const updatedArticleWithText = await fetchScrapedArticleText(article);

                        if (updatedArticleWithText === undefined) {
                            setError(
                                "Looks like some articles are missing details. Let's try searching for a wider range of articles.",
                            );
                            return;
                        }

                        const updatedArticleWithSentiment = await fetchSentimentAnalysis(updatedArticleWithText);
                        return updatedArticleWithSentiment;
                    } catch (error) {
                        console.error('Error fetching data for article:', article, error);
                    }
                }),
            );

            const updatedNews = results
                .filter((result) => result.status === 'fulfilled' && result.value)
                .map((result) => result.value);

            return updatedNews;
        };

        const updateNews = async () => {
            const currentURL = document.URL;
            const currentPage = currentURL.split('/').pop();

            const filteredNews =
                currentPage === 'InteractiveMap'
                    ? news.filter((article) => article.keywords.some((keyword) => keyword.name.toLowerCase() === 'glocations'))
                    : news;

            const articlesToScrapeTextFor = filteredNews.slice(0, count);
            const updatedNews = await fetchNewsData(articlesToScrapeTextFor);

            if (updatedNews.length > 0) setError('');

            setUpdatedNews(updatedNews);
        };
        updateNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [news]);

    return (
        <Stack gap={3} className='my-3'>
            <span className='text-center'>Total amount of available articles: {news.length}</span>

            <p className='text-center'>{error}</p>

            {updatedNews.length > 0 ? <SentimentOccurrence updatedNews={updatedNews} /> : ''}

            {currentPage === 'NewsAnalysisDate' && updatedNews.length > 0
                ? updatedNews.slice(0, count).map((n) => (
                    <NewsDisplay
                        newsData={n}
                        key={n.headline.main}
                    />
                ))
                : ''}

            {currentPage === 'InteractiveMap' && updatedNews.length > 0 ? <InteractiveMap news={updatedNews} /> : ''}
        </Stack>
    );
};

export default NewsFetch;
