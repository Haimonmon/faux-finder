import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

class GMANetwork {
    constructor() {
        this.targetLink = "https://www.gmanetwork.com/news/";
        this.helper = new GMANetworkHelper();
    }


    /**
     * 
     * @param {*} limit
     * @returns {void}
     */
    async scrape(limit) {
        const browser = await puppeteer.launch({ headless: true});
        const page = await browser.newPage();

        await page.goto(this.targetLink, {
            waitUntil: "domcontentloaded"
        });

        const justInLinks = this.helper.getJustInLinks(page, limit)

        return justInLinks
    }
}


class GMANetworkHelper {
    constructor() {

    }

    /**
     * 
     * @param {*} page - browser page.
     * @param {*} limit - limit how many items you want to get on that browser page open.
     * @returns {object} - returns an object that have article link, title, published date or time
     */
    async getJustInLinks(page, limit) {
        const dataLinks = await page.$$eval(".just-in-content a", (anchors, limit) => {
            let results = [];
            for (let i = 0; i < anchors.length && i < limit; i++) {
                const newsArticleLink = anchors[i];
                const newsTitle = newsArticleLink.querySelector(".just-in-story-title");
                const newsDatePublished = newsArticleLink.querySelector(".just-in-date-published");
                
                results.push({
                    "newsArticleLink": newsArticleLink,
                    "newsDateTimePublished": newsDatePublished ? newsDatePublished.innerText.trim() : null,
                    "newsTitle": newsTitle ? newsTitle.innerText.trim() : null
                });
            }

            return results
        }, limit);

        return dataLinks;
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