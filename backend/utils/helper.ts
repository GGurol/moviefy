import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import this helper
import Review from "../models/review";

// --- ADDED: ES Module-compatible way to get __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendError = (res, error, statusCode = 401) => {
  res.status(statusCode).json({ error });
};

export const generateRandomByte = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(30, (err, buff) => {
      if (err) reject(err);
      const buffString = buff.toString("hex");
      resolve(buffString);
    });
  });
};

export const handleNotFound = (req, res) => {
  sendError(res, "Not Found!", 404);
};

export const saveImageLocally = (file) => {
  const uploadsDir = path.join(__dirname, "../../uploads"); 
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileExt = path.extname(file.originalname);
  const newFileName = `${crypto.randomBytes(16).toString("hex")}${fileExt}`;
  const newPath = path.join(uploadsDir, newFileName);

  fs.renameSync(file.path, newPath);
  
  return `/uploads/${newFileName}`;
};

export const formateActor = (actor) => {
  const { name, gender, about, _id, avatar } = actor;
  return {
    id: _id,
    name,
    about,
    gender,
    avatar: avatar,
  };
};

export const averageRatingPipeline = (movieId) => {
  return [
    {
      $match: { parentMovie: movieId },
    },
    {
      $group: {
        _id: null,
        ratingAvg: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ];
};

export const relatedMovieAggregation = (tags, movieId) => {
  return [
    {
      $match: {
        tags: { $in: [...tags] },
        _id: { $ne: movieId },
      },
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
      },
    },
    {
      $limit: 5,
    },
  ];
};

export const topRatedMoviesPipeline = (genre) => {
  const matchOptions: any = {
    reviews: { $exists: true, $ne: [] },
    status: { $eq: "public" },
  };

  if (genre) matchOptions.genres = { $in: [genre] };

  return [
    {
      $match: matchOptions,
    },
    {
      $project: {
        title: 1,
        poster: "$poster.url",
        responsivePosters: "$poster.responsive",
        reviewCount: { $size: "$reviews" },
      },
    },
    {
      $sort: {
        reviewCount: -1,
      },
    },
    { $limit: 5 },
  ];
};

export const getAverageRatings = async (movieId) => {
  const [aggregatedResponse] = await Review.aggregate(
    averageRatingPipeline(movieId)
  );

  const reviews: { ratingAvg?: string, reviewCount?: number } = {};

  if (aggregatedResponse) {
    const { ratingAvg, reviewCount } = aggregatedResponse;
    reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
    reviews.reviewCount = reviewCount;
  }

  return reviews;
};