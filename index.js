const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const app = express()
const sources = require('./sources.json')

// Encoding interceptor for axios
iconv.skipDecodeWarning = true
axios.interceptors.response.use(response => {
    const ctype = response.headers['content-type']
    if (ctype.includes('charset=iso-8859-15')) {
        response.data = iconv.decode(response.data, 'iso-8859-15')
    }
    return response
})

// Get all news articles that are related to covid
const articles = []
sources.forEach(source => {
    axios
        .get(source.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html, {decodeEntities: false})

            let selector = 
                'a:contains("corona"), ' + 
                'a:contains("covid"), ' + 
                'a:contains("pandemic"), ' + 
                'a:contains("pandemie"), ' + 
                'a:contains("biontech"), ' + 
                'a:contains("moderna")'

            $(selector, html).each(function () {
                const title = $(this)
                    .text()
                    .trim()
                    .replace(/ {4}|[\t\n\r]/gm, ' ')
                    .replace(/ +/g, ' ')
                    
                let url = $(this).attr('href')

                if (url.startsWith('/')) {
                    url = source.base + url
                }

                articles.push({
                    title,
                    url: url,
                    source: source.name,
                    language: source.language
                })
            })
        }).catch(err => console.log(err))
})


// HOME
app.get('/', (req, res) => {
    res.json('Welcome to the COVID-19 News API')
})

// NEWS
app.get('/news', (req, res) => {
    const language = req.query.lang;

    let filteredArticles = articles
    if (language) {
        filteredArticles = articles.filter(article => article.language.toLowerCase() == language.toLowerCase())
    } 
    
    res.charset = 'utf-8'
    res.json(filteredArticles)
})

// NEWS/{source}
app.get('/news/:source', (req, res) => {
    const source = req.params.source
    const language = req.query.lang;

    let filteredArticles = articles.filter(article => article.source.toLowerCase() == source.toLowerCase())
    if (language) {
        filteredArticles = filteredArticles.filter(article => article.language.toLowerCase() == language.toLowerCase())
    } 
    
    res.charset = 'utf-8'
    res.json(filteredArticles)
})

// SOURCES
app.get('/sources', (req, res) => {
    const language = req.query.lang;

    let filteredSources = articles
        .map(({source, language}) => ({source, language}))
        .filter((value,index,array) => array.findIndex(x => (x.source === value.source)) === index)

    if (language) {
        filteredSources = filteredSources.filter(source => source.language.toLowerCase() == language.toLowerCase())
    }

    res.charset = 'utf-8'
    res.json(filteredSources)
})

// LANGUAGES
app.get('/languages', (req, res) => {
    const filteredLanguages = [...new Set(articles.map(({language}) => ({language})).map(x => x.language))]
    res.charset = 'utf-8'
    res.json(filteredLanguages)
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))
