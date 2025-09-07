import {Router} from 'express';

import ABSCBN from '../../controllers/scrapers/abscbn.js';
import PhilStar from '../../controllers/scrapers/philstar.js';
import GMANetwork from '../../controllers/scrapers/gmanetwork.js';
import HelloController from '../../controllers/scrapers/hello.js';

const scrapeRoute = new Router();

const abscbn = new ABSCBN();
const philstar = new PhilStar();
const gmanetwork = new GMANetwork();
const hello = new HelloController();

/**
 *  * Scrapers News on ABSCBN website: https://www.abs-cbn.com/
 *  ? Server Names: https://whois.domaintools.com/abs-cbn.com
 */
scrapeRoute.get("/abscbn", abscbn.news.bind(abscbn));

/**
 * * Scrapers News on Philstar website: https://www.philstar.com/
 * ? Server Names: https://whois.domaintools.com/philstar.com
 */
scrapeRoute.get("/philstar", philstar.news.bind(philstar));


/**
 * * *crapers News on GMA Network website: https://www.gmanetwork.com
 * ? Server Names: https://whois.domaintools.com/gmanetwork.com
 */
scrapeRoute.get("/gmanetwork", gmanetwork.news.bind(gmanetwork));


export default scrapeRoute;