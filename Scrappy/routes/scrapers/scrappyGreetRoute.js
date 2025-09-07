import { Router } from "express";
import HelloController from "../../controllers/scrapers/hello.js";

const scrappyRoute = new Router();
const hello = new HelloController();

// * Just a Friendly Hello :3 ✨
scrappyRoute.get('/', hello.greet.bind(hello));

export default scrappyRoute;