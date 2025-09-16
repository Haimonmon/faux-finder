import { franc } from "franc";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";


import { randomUserAgent, randomDelay } from "../../precautions/antiDetection.js";

puppeteer.use(StealthPlugin());

class GMANetwork {
    constructor() {
        this.targetLink = "https://www.gmanetwork.com/news/topstories/";
        this.helper = new GMANetworkHelper();
    }


    /**
     * Yoinks given targeted website contents.
     * @param {*} limit
     * @returns {void}
     */
    async scrape(limit) {
        const browser = await puppeteer.launch({ headless: true});
        const page = await browser.newPage();

        await page.setUserAgent(randomUserAgent());

        await page.goto(this.targetLink, {
            waitUntil: "domcontentloaded"
        });

        const justInLinks = await this.helper.lootLatestSection(page, limit)

        // console.log(justInLinks)

        const data = await this.helper.lootlatestsectionArticle(browser, justInLinks)

        return data
    }
}


class GMANetworkHelper {
    constructor() {

    }

    /**
     * just gets article links first
     * @param {*} page - browser page.
     * @param {*} limit - limit how many items you want to get on that browser page open.
     * @returns {object} - returns an object that have article link, title, published date or time
     */
    async lootLatestSection(page, limit) {
        await page.waitForSelector("#latest_section_stories_content_news a");

        const dataLinks = await page.$$eval("#latest_section_stories_content_news a", (anchors, limit) => {
            let results = [];
            for (let i = 0; i < anchors.length && i < limit; i++) {
                const newsArticleLink = anchors[i].href;
                const newsTitle = anchors[i].querySelector(".title");

                results.push({
                    "newsArticleLink": newsArticleLink,
                    "newsTitle": newsTitle ? newsTitle.innerText.trim() : null
                });
            }

            return results
        }, limit);

        return dataLinks;
    }

    /** 
     * Scrape multiple articles.
     * @param {*} browser - Puppeteer browser instance
     * @param {*} data - contains news article links and news title
     */
    async lootlatestsectionArticle(browser, data) {
        const results = []

        const tasks = data.map((article) => (async () => {
            await randomDelay(1000, article.length);

            const page = await browser.newPage();

            await page.setUserAgent(randomUserAgent());

            await page.goto(article.newsArticleLink, {
                waitUntil: "domcontentloaded"
            });

            await page.waitForSelector("article");

            const articleData = await page.evaluate(() => {
                const subhead = document.querySelector("p.subhead.metadata")?.textContent.trim() || null;
                const author =  document.querySelector(".main-byline div div")?.textContent.trim() || document.querySelector(".article-author")?.textContent.trim() || null;
                const published = document.querySelector("time[itemprop='datePublished']")?.getAttribute("datetime") || document.querySelector(".article-date")?.textContent.trim() || null;

                const date = new Date(published);
                
                const formattedPublished = date.toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true
                })

                const articleBody = document.querySelectorAll(".article-body p");
                const storyMain = document.querySelectorAll(".story_main p");

                const paragraphs = Array.from(articleBody.length ? articleBody : storyMain).map(paragraph => paragraph.innerText.trim()).filter(Boolean);

                return {
                    subhead, author, publishedDate: formattedPublished, content: paragraphs.join("\n\n")
                }
            });

            const language = franc(articleData.content || "");

            if (language == "eng") {
                results.push({
                    url: article.newsArticleLink,
                    headline: article.newsTitle,
                    subheadline: articleData.subhead,
                    author: articleData.author,
                    published: articleData.publishedDate,
                    contentt: articleData.content
                })
            }
        
            await page.close();
        })());

        await Promise.all(tasks);

        return results;
    }
}


class GMANetworkController {
    constructor() {
        this.target = new GMANetwork();
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * 
     */
    async news(req, res) {
        // * Default of 2 news data to be scraped
        const limit = req.query.limit ? parseInt(req.query.limit) : 2;

        let scrapedData = await this.target.scrape(limit)

        if (scrapedData) {
             res.json({
                "success": true,
                "source": this.target.targetLink,
                "message": "Succesfully Scraped Data on GMA Network 🍺🤓☝️✨",
                "data": scrapedData
            })
        }
    }
}

export default GMANetworkController