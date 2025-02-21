import { getAppInfo, getMostRated } from "../controllers/admin";
import { isAuth, isAdmin } from "../middlewares/auth";

const router = require("express").Router();

router.get("/app-info", isAuth, isAdmin, getAppInfo);
router.get("/most-rated", isAuth, isAdmin, getMostRated);

export default router;
