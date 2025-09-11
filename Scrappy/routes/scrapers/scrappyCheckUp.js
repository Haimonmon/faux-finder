import { Router } from "express";
import SannySoftController from "../../controllers/scrapers/precaution.js";

const scrappyCheckUpRoute = new Router();
const sanny = new SannySoftController();

scrappyCheckUpRoute.get('/check-up', sanny.checkUp.bind(sanny));

export default scrappyCheckUpRoute;