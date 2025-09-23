import {
  sendError,
  formateActor,
  averageRatingPipeline,
  relatedMovieAggregation,
  getAverageRatings,
  topRatedMoviesPipeline,
  saveImageLocally, // Use our local save function
} from "../utils/helper";
import Movie from "../models/movie";
import Review from "../models/review";
import { isValidObjectId } from "mongoose";
import fs from "fs";
import path from "path";

export const createMovie = async (req, res) => {
  const { files, body } = req;
  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writer,
    language,
  } = body;

  const newMovie = new Movie({
    title,
    storyLine,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    language,
  });

  if (director) {
    if (!isValidObjectId(director)) {
      return sendError(res, "Invalid director ID");
    }
    newMovie.director = director;
  }

  if (writer) {
    if (!isValidObjectId(writer)) {
      return sendError(res, "Invalid writer ID");
    }
    newMovie.writer = writer;
  }

  // Handle video upload locally
  if (files?.video?.[0]) {
    const videoUrl = saveImageLocally(files.video[0]);
    newMovie.video = videoUrl;
  }

  // Handle poster upload locally
  if (files?.poster?.[0]) {
    const posterUrl = saveImageLocally(files.poster[0]);
    newMovie.poster = posterUrl;
  }

  await newMovie.save();

  res.status(201).json({ movie: { id: newMovie._id, title } });
};

export const updateMovie = async (req, res) => {
  const { movieId } = req.params;
  const { files, body } = req;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found", 404);

  const {
    title,
    storyLine,
    director,
    releaseDate,
    status,
    type,
    genres,
    tags,
    cast,
    writer,
    language,
  } = body;

  movie.title = title;
  movie.storyLine = storyLine;
  movie.releaseDate = releaseDate;
  movie.status = status;
  movie.type = type;
  movie.genres = genres;
  movie.tags = tags;
  movie.cast = cast;
  movie.language = language;

  if (director) {
    if (!isValidObjectId(director))
      return sendError(res, "Invalid director ID");
    movie.director = director;
  }

  if (writer) {
    if (!isValidObjectId(writer)) return sendError(res, "Invalid writer ID");
    movie.writer = writer;
  }

  // Handle video update
  if (files?.video?.[0]) {
    const oldVideo = movie.video;
    if (oldVideo) {
      try {
        const fullPath = path.join(__dirname, "../../", oldVideo);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      } catch (error) {
        console.error("Failed to remove old video:", error);
      }
    }
    movie.video = saveImageLocally(files.video[0]);
  }

  // Handle poster update
  if (files?.poster?.[0]) {
    const oldPoster = movie.poster;
    if (oldPoster) {
      try {
        const fullPath = path.join(__dirname, "../../", oldPoster);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      } catch (error) {
        console.error("Failed to remove old poster:", error);
      }
    }
    movie.poster = saveImageLocally(files.poster[0]);
  }

  await movie.save();

  res.json({
    message: "Movie is updated",
    movie: {
      id: movie._id,
      title: movie.title,
      poster: movie.poster, // Corrected: No .url property needed
      genres: movie.genres,
      status: movie.status,
    },
  });
};

export const removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found", 404);

  // Delete poster file if it exists
  if (movie.poster) {
    try {
      const fullPath = path.join(__dirname, "../../", movie.poster);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (error) {
      console.error("Failed to remove poster on delete:", error);
    }
  }

  // Delete video file if it exists
  if (movie.video) {
    try {
      const fullPath = path.join(__dirname, "../../", movie.video);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    } catch (error) {
      console.error("Failed to remove video on delete:", error);
    }
  }

  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "Movie removed successfully" });
};

export const getMovies = async (req, res) => {
  const { pageNo = "0", limit = "10" } = req.query;
  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo as string) * parseInt(limit as string))
    .limit(parseInt(limit as string));

  const results = movies.map((movie) => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster, // Corrected: No .url property
    genres: movie.genres,
    status: movie.status,
  }));

  res.json({ movies: results });
};

export const getMovieForUpdate = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID");

  const movie = await Movie.findById(movieId).populate("director writer cast");
  if (!movie) return sendError(res, "Movie not found", 404);

  res.json({
    movie: {
      id: movie._id,
      title: movie.title,
      storyLine: movie.storyLine,
      poster: movie.poster, // Corrected
      releaseDate: movie.releaseDate,
      status: movie.status,
      type: movie.type,
      genres: movie.genres,
      tags: movie.tags,
      language: movie.language,
      director: formateActor(movie.director),
      writer: formateActor(movie?.writer),
      cast: movie.cast.map((c: any) => ({
        id: c._id,
        name: c.name,
        avatar: c.avatar, // Corrected
      })),
    },
  });
};

export const searchMovies = async (req, res) => {
  const { title } = req.query;

  if (!title || !(title as string).trim())
    return sendError(res, "Invalid request");
  const movies = await Movie.find({
    title: { $regex: title, $options: "i" },
  });

  const results = movies.map((m) => ({
    id: m._id,
    title: m.title,
    poster: m.poster, // Corrected
    genres: m.genres,
    status: m.status,
  }));

  res.json({ results });
};

export const getLatestUploads = async (req, res) => {
  const { limit = 5 } = req.query;

  const results = await Movie.find({ status: "public" })
    .sort("-createdAt")
    .limit(parseInt(limit as string));

  const movies = results.map((m) => ({
    id: m._id,
    title: m.title,
    storyLine: m.storyLine,
    poster: m.poster, // Corrected
    video: m.video, // Corrected
  }));

  res.json({ movies });
};

export const getSingleMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID");

  const movie = await Movie.findById(movieId).populate("director writer cast");
  if (!movie) return sendError(res, "Movie not found", 404);

  const reviews = await getAverageRatings(movie._id);

  const {
    _id: id,
    title,
    storyLine,
    cast,
    writer,
    director,
    releaseDate,
    genres,
    tags,
    language,
    poster,
    video,
    type,
  } = movie;

  res.json({
    movie: {
      id,
      title,
      storyLine,
      releaseDate,
      genres,
      tags,
      language,
      type,
      poster: poster, // Corrected
      video: video, // Corrected
      cast: (cast as any[]).map((c) => ({
        id: c._id,
        name: c.name,
        avatar: c.avatar, // Corrected
      })),
      writer: formateActor(writer),
      director: formateActor(director),
      reviews,
    },
  });
};

export const getRelatedMovies = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie ID");

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found", 404);

  const movies = await Movie.aggregate(
    relatedMovieAggregation(movie.tags, movie._id)
  );

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      reviews,
    };
  };
  const relatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: relatedMovies });
};

export const getTopRatedMovies = async (req, res) => {
  const { genre } = req.query;
  if (typeof genre !== "string")
    return sendError(res, "Genre must be a string");
  const movies = await Movie.aggregate(topRatedMoviesPipeline(genre));

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      reviews,
    };
  };
  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};

export const searchPublicMovies = async (req, res) => {
  const { title } = req.query;

  if (!title || !(title as string).trim())
    return sendError(res, "Invalid request");

  const movies = await Movie.find({
    title: { $regex: title, $options: "i" },
    status: "public",
  });

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster, // Corrected
      reviews,
    };
  };
  const results = await Promise.all(movies.map(mapMovies));

  res.json({
    results,
  });
};

export const getMoviesByTag = async (req, res) => {
  const { tag, limit } = req.query;
  if (typeof tag !== "string" || typeof limit !== "string")
    return sendError(res, "Invalid query params");
  const results = await Movie.find({
    status: "public",
    tags: { $regex: tag, $options: "i", $in: [tag] },
  })
    .sort("-createdAt")
    .limit(parseInt(limit));

  const movies = results.map((m) => ({
    id: m._id,
    title: m.title,
    storyLine: m.storyLine,
    poster: m.poster, // Corrected
    video: m.video, // Corrected
  }));

  res.json({ movies });
};