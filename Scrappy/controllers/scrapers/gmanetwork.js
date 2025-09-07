class GMANetwork {
    constructor() {
        this.target_link = "https://www.gmanetwork.com/";
    }


    /**
     * 
     * @param {*} limit
     * @returns {void}
     */
    scrape(limit) {
        let data = "Working 1"
        return data
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
    news(req, res) {
        // * Default of 2 news data to be scraped
        const limit = req.query.limit ? parseInt(req.query.limit) : 2;

        let scraped_data = this.target.scrape(limit)

        if (scraped_data) {
             res.json({
                "success": true,
                "source": this.target.target_link,
                "message": "Succesfully Scraped Data on GMA Network 🍺🤓☝️✨",
                "data": scraped_data
            })
        }
    }
}

export default GMANetworkController