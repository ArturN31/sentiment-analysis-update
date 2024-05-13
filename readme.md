# Updated version of a sentiment analysis project

This project was originally developed for educational purposes during a university course on Artificial Intelligence. The initial version utilised external APIs. However, due to changes in API availability, the project has been refactored to incorporate independent functionalities.

Throughout the development process, the project adhered to the guidelines and regulations set forth by the university module. Additionally, the legality of any implemented techniques, such as web scraping, was carefully assessed in consultation with module leaders to ensure compliance with copyright and ethical considerations.

Client:

- JavaScript
- React (web framework)
- Bootstrap (CSS framework)
- CSS
- React Leaflet Map
- React DatePicker

Server:

- JavaScript (Node.js)
- Express (web framework)
- CORS middleware
- Natural: Natural language processing library for sentiment analysis
- Cheerio: Traversing/Manipulating of DOM - scraping article text

# Project Motivation

In today's information age, the sheer volume of news and potential for emotional bias make it challenging to grasp the true sentiment behind headlines. This project, born from a desire to empower users with a deeper understanding, has evolved from a group effort utilising external APIs (now unavailable) to a robust, self-reliant news analysis engine powered by an Express API.

This shift towards self-reliance fuels several key motivations:

- Enduring Functionality: Building independent data retrieval and sentiment analysis ensures long-term sustainability, free from external API disruptions.
- Empowering Control: In-house solutions grant greater control over the data processing pipeline, allowing for fine-tuning to perfectly align with project goals.
- Unveiling Innovation Potential: Moving beyond external APIs opens doors for exploring cutting-edge techniques and pushing the project's analytical capabilities.

This project, now a testament to my independent efforts, fosters a resilient and flexible foundation primed for ongoing development and exploration. It aims to bridge the gap between traditional news consumption and a deeper understanding of the emotional drivers behind current events, ultimately delivering a more powerful and insightful news analysis engine.

## Unveiling the Power of News Analysis: Exploring What This App Does

This application empowers users to delve into the world of news with a unique blend of features, making it easier than ever to stay informed and understand the emotional undercurrents of current events. Here's a breakdown of its functionalities:

**Finding the News You Care About:**

- Search by Theme: Want to stay up-to-date on a specific topic? Explore articles related to chosen themes using a secure API connection. No more sifting through irrelevant content!
- Travel Back in Time: Interested in a particular month or year? Dive into the past by searching for news articles from specific dates, with a maximum of 200 articles retrieved per request.

**Unmasking the Hidden Text:**

\*Harnessing the Power of APIs: Our app leverages a publicly available API to retrieve URLs for news articles from the New York Times. This ensures we focus on content authorised for access. Once we have the URLs, the app helps you explore the sentiment within the articles text.

**Mapping the World of News:**

- Locating the Stories: Ever wondered where news is happening? This innovative feature (powered by OpenStreetMap) retrieves geographic coordinates for chosen locations, allowing you to visualise news articles (by month/year) on a map. Clicking on a marker reveals details like headlines, publication dates, and even sentiment analysis!

**Unveiling the Emotional Pulse:**

- Sentiment Analysis: Go beyond the surface and understand the emotional tone of news articles (and even user-provided text!). This advanced feature analyses sentiment using multiple tools, highlighting potential sarcasm or mixed emotions. It also assigns weights to scores for nuanced analysis and calculates a confidence score based on agreement between analysis methods.
- Categorising Emotions: Delve deeper by exploring the emotions associated with the sentiment (e.g., joy, anger) and their intensity (e.g., strong, mild). This extra layer of insight helps you grasp the emotional impact of the news.
- Sentiment Breakdown: Curious about the overall sentiment across retrieved articles? This feature calculates the frequency of different sentiment categories (positive, negative, neutral) and displays them visually, making it easy to see the emotional landscape at a glance.
