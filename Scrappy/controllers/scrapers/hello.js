class HelloController {
    constructor() {
        this.target = "🎉 Hello from Scrappy!, just be carefull for what you want haha ☝️🤓.";
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     * 
     */
    greet(req, res) {
        res.json({
            "message": this.target,
        })
        res.end()
    }
}

export default HelloController