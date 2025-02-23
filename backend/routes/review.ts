import { addReview, updateReview, removeReview, getReviewsByMovie } from "../controllers/review";
import { isAuth } from "../middlewares/auth";
import { validateRatings, validate } from "../middlewares/validator";
import express from "express";

const router = express.Router();

router.post("/add/:movieId", isAuth, validateRatings, validate, addReview);
router.patch("/:reviewId", isAuth, validateRatings, validate, updateReview);
router.delete("/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);

export default router;
