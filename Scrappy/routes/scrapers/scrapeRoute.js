import {Router} from 'express';

import BBCController from '../../controllers/scrapers/bbc.js';
import GMANetworkController from '../../controllers/scrapers/gmanetwork.js';

const scrapeRoute = new Router();

const bbc = new BBCController();
const gmanetwork = new GMANetworkController();


/**
 * * For global english articles
 * * Scrapers News on BBC website: https://www.bbc.com/news
 * ? Server Names: https://www.whois.com/whois/bbc.com
 */
scrapeRoute.get("/bbc", bbc.news.bind(bbc));


/** 
 * * For local news but scrapes english articles
 * * Scrapers News on GMA Network website: https://www.gmanetwork.com
 * ? Server Names: https://whois.domaintools.com/gmanetwork.com
 */
scrapeRoute.get("/gmanetwork", gmanetwork.news.bind(gmanetwork));


export default scrapeRoute;