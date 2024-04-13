const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app =  express()
const url = `https://www.swordandboard.co.za/collections/board-games?page=1`

axios(url).then(res => {
    const html = res.data
    const $ = cheerio.load((html))
    const gameTitles = []
    try {
        $('.grid-view-item__title', html).each( function() {
            const title = $(this).text()
            gameTitles.push(title)
        })
        console.log(gameTitles)
    } catch (error) {
        console.log(error)
    }
})


app.listen(PORT, ()=> console.log(`Running on PORT:${PORT}`) )