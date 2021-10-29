# COVID-19 News API
A simple news API for COVID-19 related news articles.

## Motivation
I created this news API to get hands-on practice with Node.js and NPM.

## Technologies used
- Node.js
- axios
- cheerio
- express
- iconv-lite

## Endpoints
The COVID-19 News API allows to query for news articles either without any filter or filtered by source and/or language.

### NEWS
```javascript
GET /news
GET /news?lang={id}
GET /news/{source}
GET /news/{source}?lang={id}
```

### SOURCES
```javascript
GET /sources
GET /sources?lang={id}
```

### LANGUAGES
```javascript
GET /languages
```

## How to use
In order to run this project on your local machine, you need to follow the below steps:
- Clone the repository
- Execute ``npm i`` in your terminal to install all packages 
- Execute ``npm run start`` in your terminal to start the webserver
- Open http://localhost:8000/news in your browser to get all news articles