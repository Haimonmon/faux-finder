import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

class PhilStar {
    constructor() {
        this.targetLink = "https://www.philstar.com/";
    }


    /**
     * 
     * @param {*} limit 
     * @returns {void}
     */
    scrape(limit) {
        let data = "Working 3"
        return data
    }
}


class PhilStarController {
    constructor() {
        this.target = new PhilStar();
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
            "message": "Succesfully Scraped Data on PhilStar 🍺🤓☝️✨",
            "data": scrapedData
        })
    }
}

export default PhilStarController