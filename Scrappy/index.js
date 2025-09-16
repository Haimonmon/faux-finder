import 'dotenv/config.js';

import express from 'express';

import scrapers from "./routes/scrapers/index.js"

const scrappy = express();
const port = process.env.SCRAPPY_PORT || 3000;

scrappy.use("/scrappy", scrapers)

scrappy.listen(port, "0.0.0.0");