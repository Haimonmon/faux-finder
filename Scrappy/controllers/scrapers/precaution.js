import path from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

import { randomUserAgent, randomDelay } from "../../precautions/antiDetection.js";

puppeteer.use(StealthPlugin());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SannySoft {
    constructor() {
        this.targetLink = 'https://bot.sannysoft.com/';
    }


    /**
     * 
     * @param {*} limit 
     * @returns {void}
     */
    async sannyCheckUp() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();

        await page.setUserAgent(randomUserAgent());

        await page.goto("https://bot.sannysoft.com/", {
            waitUntil: "networkidle2"
        });

        const screenshotPath = path.join(__dirname, `../../precautions/dailycheckup/TEST-SCRAPPY-CHECKUP-${this.getCurrentDate()}.jpg`);
        await page.screenshot({ path: screenshotPath});

        await browser.close();
    }


    /**
     * 
     * @returns {string} - a formatted date example: JULY-19-2001
     */
    getCurrentDate() {
        const date = new Date();

        const months = [
            "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
            "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
        ];

        const formattedDate = `${months[date.getMonth()]}-${date.getDate()}-${date.getFullYear()}`;

        return formattedDate
    }
}


class SannySoftController {
    constructor() {
        this.target = new SannySoft();
    }

    /**
     * 
     * @param {*} req 
     * @param {*} res 
     */
    async checkUp(req, res) {
        try {
            await this.target.sannyCheckUp();

            res.json({
                "success": true,
                "source": this.target.targetLink,
                "message": "Succesfully get checked up 🧑‍⚕️❤️‍🩹",
            })
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
       
    }
}

export default SannySoftController;