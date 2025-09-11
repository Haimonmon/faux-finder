import express from 'express';

import scrapers from "./routes/scrapers/index.js"

const scrappy = express();
const port = 3000;

scrappy.use("/scrappy", scrapers)

scrappy.listen(port);