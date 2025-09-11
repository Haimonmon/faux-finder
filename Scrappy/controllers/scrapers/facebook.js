import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

class Facebook {
    constructor() {
        this.targetLink = "https://www.facebook.com/";
    }


    /**
     * 
     * @param {*} limit 
     * @returns {void}
     */
    scrape(limit) {
        let data = "Working 4"
        return data
    }
}


class FacebookController {
    constructor() {
        this.target = new Facebook();
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * 
     */
    news(req, res) {
        // * Default of 2 news data to be scraped
        const limit = req.query.limit ? parseInt(req.query.limit) : 2;

        let scrapedData = this.target.scrape(limit)

        res.json({
            "success": true,
            "source": this.target.targetLink,
            "message": "Succesfully Scraped Data on Facebook 🍺🤓☝️✨",
            "data": scrapedData
        })
    }
}

export default FacebookController
