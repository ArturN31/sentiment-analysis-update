# Updated version of a sentiment analysis project

Client:

- JavaScript
- React (web framework)
- Bootstrap (CSS framework)
- CSS
- React Leaflet Map
- React Date Picker

Server:

- JavaScript (Node.js)
- Express (web framework)
- CORS middleware
- Natural: Natural language processing library for sentiment analysis
- Cheerio: Traversing/Manipulating of DOM - scraping article text

# Project Motivation

This project implements its own sentiment analysis and data retrieval functionalities due to limitations with external APIs.

- Eliminates reliance on external APIs for sentiment analysis and data scraping.

# Functionalities

- News Retrieval:
  - Retrieve URLs of New York Times articles based on a chosen theme.
  - Retrieve URLs of New York Times articles based on a chosen month and year.
- Web Scraping:
  - Scrape the text content from retrieved New York Times articles.
- Sentiment Analysis:
  - Analyse the sentiment of user-provided text.
  - Analyse the sentiment of news articles retrieved based on:
    - Theme selection.
    - Month and year selection.
- Interactive Map:
  - Display retrieved news articles (by month/year) as pins on a map.
  - Clicking a pin displays a popup with the article's details.
