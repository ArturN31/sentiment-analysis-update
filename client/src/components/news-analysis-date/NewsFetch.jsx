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

    const [currentPage, setCurrentPage] = useState('');

    useEffect(() => {
        setCurrentPage(document.URL.split('/').pop());

        const fetchNewsByDate = async () => {
            try {
                let url = ''
                if (import.meta.env.DEV) {
                    url = 'http://localhost:3001/api/getNewsByDate'
                } else {
                    url = 'https://sentiment-analysis-server.vercel.app/api/getNewsByDate'
                }

                const options = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ month: month, year: year }),
                };
                const response = await fetch(url, options);
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
                let url = ''
                if (import.meta.env.DEV) {
                    url = 'http://localhost:3001/api/scrapeArticleData'
                } else {
                    url = 'https://sentiment-analysis-server.vercel.app/api/scrapeArticleData'
                }

                const response = await fetch(url, {
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
                }
            } catch (error) {
                console.error(error);
            }
        };

        const fetchSentimentAnalysis = async (article) => {
            if (article.text) {
                try {
                    let url = ''
                    if (import.meta.env.DEV) {
                        url = 'http://localhost:3001/api/sentimentAnalysis'
                    } else {
                        url = 'https://sentiment-analysis-server.vercel.app/api/sentimentAnalysis'
                    }

                    const response = await fetch(url, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: article.text, purpose: 'news' }),
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
            setUpdatedNews(updatedNews);
        };
        updateNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [news]);

    return (
        <Stack gap={3} className='mb-3'>
            {news.length > 0 ? <p className='text-center m-0'>Available articles: {news.length}</p> : ''}

            {updatedNews.length > 0
                ? <SentimentOccurrence updatedNews={updatedNews} />
                : <div className="text-center text-break col-10 col-md-8 col-xl-6 mx-auto">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="ms-2 my-auto">Retrieving and processing articles...</p>
                    {import.meta.env.DEV ? '' : <p className="ms-2 my-auto">This feature works only in development environment.</p>}
                </div>}

            {/* Displayed only on the News Analysis by Date page */}
            {currentPage === 'NewsAnalysisDate' && updatedNews.length > 0
                ? updatedNews.slice(0, count).map((n) => (
                    <NewsDisplay
                        newsData={n}
                        key={n.headline.main}
                    />
                ))
                : ''}

            {/* Displayed only on the Interactive Map page */}
            {currentPage === 'InteractiveMap' && updatedNews.length > 0 ? <InteractiveMap news={updatedNews} /> : ''}
        </Stack>
    );
};

export default NewsFetch;
