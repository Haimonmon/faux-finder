import express from 'express';

import scrapers from "./routes/scrapers/index.js"

const scrappy = express();
const port = 3000;

scrappy.use("/scrappy", scrapers)

scrappy.listen(port, () => {
  console.log(` [ Scrappy 🎉 ] \n -------------------------------------------------- \n running at port: http://localhost:${port}/scrappy/ \n --------------------------------------------------`)
});