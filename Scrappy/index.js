import 'dotenv/config.js';

import express from 'express';
import cors from "cors";

import scrapers from "./routes/scrapers/index.js"

const scrappy = express();

const port = process.env.SCRAPPY_PORT || 3000;

scrappy.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

scrappy.use("/scrappy", scrapers)

scrappy.listen(port, "0.0.0.0", () => {
    console.log(`✅ Scrappy API running at http://localhost:${port}/scrappy`)
});