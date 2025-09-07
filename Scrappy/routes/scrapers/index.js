import { Router } from 'express';

import scrappyRoute from './scrappyGreetRoute.js';
import scrapeRoute from './scrapeRoute.js';

const scraper = new Router();

scraper.use('/scrape', scrapeRoute);

scraper.use('/', scrappyRoute);

export default scraper