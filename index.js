const PORT = 8000;
const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
const customsearch = google.customsearch('v1');
const config = require('./config');

const app = express();
const prisma = new PrismaClient();
const url = `https://www.swordandboard.co.za/collections/board-games`;

app.use(express.json());

let pageCount;

axios(url)
    .then(res => {
        const html = res.data;
        const $ = cheerio.load(html);
        try {
            $('.pagination_collection .item:last-child', html).each(function() {
                pageCount = $(this).text();
                console.log(pageCount);
            });
        } catch (error) {
            console.log(error);
        }
    })
    .then(async () => {
        if (pageCount) { 
            const gamesList = []
            for (let i = 1; i <= 2; i++) {
                try {
                    const res = await axios(`${url}?page=${i}`);
                    const html = res.data;
                    const $ = cheerio.load(html);
                    $('.grid-view-item', html).each(async function() {
                        try {
                            const available = $(this).find('#ProductSelect-Dropdown option:selected').text();
                            if (available !== "Sold Out") {
                                const price = $(this).find('.product-price__price').text();
                                const link = $(this).find('.product-description a').attr('href');
                                const title = $(this).find('.grid-view-item__title').text();
                                gamesList.push({
                                    title: title,
                                    price: price,
                                    swordAndBoardLink: link
                                })
                                
                            }
                        } catch (error) {
                            console.error('Error in scraping:', error);
                        }
                    });                    
                } catch (error) {
                    console.log(error);
                }
            }
            
            for (const game of gamesList){
                const existingGame = await prisma.game.findFirst({
                    where: {
                        title: game.title,
                        NOT: {
                            swordAndBoard: true
                        }
                    }
                });

                if (!existingGame) {
                    const retrievedGame = await prisma.game.findFirst({
                        where: {
                            title: game.title,
                            swordAndBoard: true
                        }
                    });

                    if (!retrievedGame) {
                        customsearch.cse.list({
                            auth: config.ggApiKey,
                            cx: config.ggCx,
                            q: game.title,
                            start: 1,
                            num: 1
                        }).then(result => result.data)
                        .then((result) => {
                        const { queries, items, searchInformation } = result;
                        console.log(items)
                        })
                        await prisma.game.create({
                            data: {
                                title: game.title,
                                price: game.price,
                                swordAndBoard: true,
                                swordAndBoardLink: game.swordAndBoardLink
                            }
                        });
                    } else if (retrievedGame.price !== game.price) {
                        await prisma.game.update({
                            where: { id: retrievedGame.id },
                            data: { price: game.price }
                        });
                    }
                } else {
                    await prisma.game.update({
                        where: { id: existingGame.id },
                        data: { 
                            swordAndBoard: true,
                            swordAndBoardLink: game.swordAndBoardLink
                         }
                    });
                }
            }
        }
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });