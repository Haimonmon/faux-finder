import { Router } from 'express';

import scrapeRoute from './scrapeRoute.js';
import scrappyRoute from './scrappyGreetRoute.js';
import scrappyCheckUpRoute from './scrappyCheckUp.js';

const scraper = new Router();

scraper.use('/', scrappyCheckUpRoute);

scraper.use('/scrape', scrapeRoute);

scraper.use('/', scrappyRoute);

export default scraper