import express from "express";
import { isAuth, isAdmin } from "../middlewares/auth";
import { uploadVideo, uploadImage, upload } from "../middlewares/multer";
import {
  createMovie,
  removeMovie,
  getMovies,
  getMovieForUpdate,
  updateMovie,
  searchMovies,
  getLatestUploads,
  getSingleMovie,
  getRelatedMovies,
  getTopRatedMovies,
  searchPublicMovies,
  getMoviesByTag,
} from "../controllers/movie";
import { parseData } from "../middlewares/helper";
import { validateMovie, validate } from "../middlewares/validator";

const router = express.Router();

// router.post("/upload-trailer", isAuth, isAdmin, uploadVideo.single("video"), uploadTrailer);
// router.post(
//   "/upload-trailer",
//   isAuth,
//   isAdmin,
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "poster", maxCount: 1 },
//   ]),
//   uploadTrailer
// );

router.post(
  "/create",
  isAuth,
  isAdmin,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "poster", maxCount: 1 },
  ]),
  parseData,
  validateMovie,
  // validateTrailer,
  validate,
  createMovie
);

router.patch(
  "/update/:movieId",
  isAuth,
  isAdmin,
  uploadImage.single("poster"),
  parseData,
  validateMovie,
  validate,
  updateMovie
);

router.delete("/:movieId", isAuth, isAdmin, removeMovie);
router.get("/movies", isAuth, isAdmin, getMovies);
router.get("/for-update/:movieId", isAuth, isAdmin, getMovieForUpdate);
router.get("/search", isAuth, isAdmin, searchMovies);

// for normal users
router.get("/latest-uploads", getLatestUploads);
router.get("/single/:movieId", getSingleMovie);
router.get("/related/:movieId", getRelatedMovies);
router.get("/top-rated", getTopRatedMovies);
router.get("/search-public", searchPublicMovies);
router.get("/by-tag", getMoviesByTag);

export default router;
