# COVID-19 News API
A simple news API for COVID-19 related news articles.

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