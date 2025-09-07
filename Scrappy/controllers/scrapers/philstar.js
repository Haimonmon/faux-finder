class PhilStar {
    constructor() {
        this.target_link = "https://www.philstar.com/";
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

        let scraped_data = this.target.scrape(limit)

        res.json({
            "success": true,
            "source": this.target.target_link,
            "message": "Succesfully Scraped Data on PhilStar 🍺🤓☝️✨",
            "data": scraped_data
        })
    }
}

export default PhilStarController