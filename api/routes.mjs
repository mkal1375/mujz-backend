import { Router } from "express";
import * as controllers from "./controllers.mjs";

const router = Router();

router.post("/cut", controllers.shortening);

export default router;
