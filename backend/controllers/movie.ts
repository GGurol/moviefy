import cloudinary from "../cloud";
import {
  sendError,
  formateActor,
  averageRatingPipeline,
  relatedMovieAggregation,
  getAverageRatings,
  topRatedMoviesPipeline,
} from "../utils/helper";
import Movie from "../models/movie";
import Review from "../models/review";
import { isValidObjectId } from "mongoose";

// export const uploadTrailer = async (req, res) => {
//   const { file, files } = req;
//   console.log(files);
//   if (!file) return sendError(res, "Video file is missing!");

//   const { secure_url: url, public_id } = await cloudinary.uploader.upload(file.path, {
//     resource_type: "video",
//   });

//   res.status(201).json({ url, public_id });
// };

export const createMovie = async (req, res) => {
  const { files, body } = req;
  if (!files) {
    return sendError(res, "File is missing!");
  }

  const { title, storyLine, director, releaseDate, status, type, genres, tags, cast, writer, language } = body;

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
      return sendError(res, "Invalid director id!");
    }
    newMovie.director = director;
  }

  if (writer) {
    if (!isValidObjectId(writer)) {
      return sendError(res, "Invalid writer id!");
    }
    newMovie.writer = writer;
  }

  if (files.video[0]) {
    const { secure_url: url, public_id } = await cloudinary.uploader.upload(files.video[0].path, {
      resource_type: "video",
    });
    newMovie.video = { url, public_id };
  }

  // uploading poster
  if (files.poster[0]) {
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(files.poster[0].path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      // https://www.responsivebreakpoints.com/
      // https://cloudinary.com/documentation/image_upload_api_reference#upload_optional_parameters
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalPoster = { url, public_id, responsive: [] };
    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }
    newMovie.poster = finalPoster;
  }

  await newMovie.save();

  // console.log(cloudRes);
  // console.log(cloudRes.responsive_breakpoints[0].breakpoints);

  res.status(201).json({ movie: { id: newMovie._id, title } });
};

// export const updateMovieWithoutPoster = async (req, res) => {
//   const { movieId } = req.params;

//   if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id!");

//   const movie = await Movie.findById(movieId);
//   if (!movie) return sendError(res, "Movie not found!", 404);

//   const { title, storyLine, director, releseDate, status, type, genres, tags, cast, writers, trailer, language } =
//     req.body;

//   movie.title = title;
//   movie.storyLine = storyLine;
//   movie.releseDate = releseDate;
//   movie.status = status;
//   movie.type = type;
//   movie.genres = genres;
//   movie.tags = tags;
//   movie.cast = cast;
//   movie.trailer = trailer;
//   movie.language = language;

//   if (director) {
//     if (!isValidObjectId(director)) return sendError(res, "Invalid director id!");
//     movie.director = director;
//   }

//   if (writers) {
//     for (let writerId of writers) {
//       if (!isValidObjectId(writerId)) return sendError(res, "Invalid writer id!");
//     }

//     movie.writers = writers;
//   }

//   await movie.save();

//   res.json({ message: "Movie is updated", movie });
// };

export const updateMovie = async (req, res) => {
  const { movieId } = req.params;
  const { files } = req;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id!");

  // if (!req.file) return sendError(res, 'Movie poster is missing!');

  const movie = await Movie.findById(movieId);
  if (!movie) return sendError(res, "Movie not found!", 404);

  const { title, storyLine, director, releaseDate, status, type, genres, tags, cast, writer, language } = req.body;

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
    if (!isValidObjectId(director)) return sendError(res, "Invalid director id!");
    movie.director = director;
  }

  if (writer) {
    if (!isValidObjectId(writer)) return sendError(res, "Invalid writer id!");
    movie.writer = writer;
  }

  if (files.video[0]) {
    const videoID = movie.video?.public_id;
    if (videoID) {
      const { result } = await cloudinary.uploader.destroy(videoID);
      if (result !== "ok") return sendError(res, "Could not update video at the moment!");
    }

    const { secure_url: url, public_id } = await cloudinary.uploader.upload(files.video[0].path, {
      resource_type: "video",
    });
    movie.video = { url, public_id };
  }

  // update poster
  if (files.poster[0]) {
    // removing poster from cloud if there is any
    const posterID = movie.poster?.public_id;
    if (posterID) {
      const { result } = await cloudinary.uploader.destroy(posterID);
      if (result !== "ok") return sendError(res, "Could not update poster at the moment!");
    }

    // uploading poster
    const {
      secure_url: url,
      public_id,
      responsive_breakpoints,
    } = await cloudinary.uploader.upload(files.poster[0].path, {
      transformation: {
        width: 1280,
        height: 720,
      },
      // https://www.responsivebreakpoints.com/
      // https://cloudinary.com/documentation/image_upload_api_reference#upload_optional_parameters
      responsive_breakpoints: {
        create_derived: true,
        max_width: 640,
        max_images: 3,
      },
    });

    const finalPoster = { url, public_id, responsive: [] };
    const { breakpoints } = responsive_breakpoints[0];
    if (breakpoints.length) {
      for (let imgObj of breakpoints) {
        const { secure_url } = imgObj;
        finalPoster.responsive.push(secure_url);
      }
    }

    movie.poster = finalPoster;
  }

  await movie.save();

  res.json({
    message: "Movie is updated",
    movie: {
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      genres: movie.genres,
      status: movie.status,
    },
  });
};

export const removeMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id!");

  const movie = await Movie.findById(movieId);
  // console.log(movie);
  if (!movie) return sendError(res, "Movie not found!", 404);

  // check if there is any poster
  // if yes then we need to remove it from cloudinary
  const posterId = movie.poster?.public_id;

  if (posterId) {
    const { result } = await cloudinary.uploader.destroy(posterId);
    if (result !== "ok") return sendError(res, "Could not remove poster at the moment!");
  }

  // removing trailer
  const videoId = movie.video?.public_id;
  if (!videoId) return sendError(res, "Could not find video in the cloud!");

  const { result } = await cloudinary.uploader.destroy(videoId, {
    resource_type: "video",
    //  Default: image.
  });

  if (result !== "ok") return sendError(res, "Could not remove video at the moment!");

  await Movie.findByIdAndDelete(movieId);

  res.json({ message: "Movie removed successfully" });
};

export const getMovies = async (req, res) => {
  const { pageNo = 0, limit = 10 } = req.query;
  const movies = await Movie.find({})
    .sort({ createdAt: -1 })
    .skip(parseInt(pageNo) * parseInt(limit))
    .limit(parseInt(limit));

  const results = movies.map((movie) => ({
    id: movie._id,
    title: movie.title,
    poster: movie.poster?.url,
    responsivePosters: movie.poster?.responsive,
    genres: movie.genres,
    status: movie.status,
  }));

  res.json({ movies: results });
};

export const getMovieForUpdate = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id!");

  // Populating Multiple Paths in Middleware
  const movie = await Movie.findById(movieId).populate("director writer cast");
  // console.log(movie);

  res.json({
    movie: {
      id: movie._id,
      title: movie.title,
      storyLine: movie.storyLine,
      poster: movie.poster?.url,
      releaseDate: movie.releaseDate,
      status: movie.status,
      type: movie.type,
      genres: movie.genres,
      tags: movie.tags,
      language: movie.language,
      director: formateActor(movie.director),
      writer: formateActor(movie?.writer),
      cast: movie.cast.map((c) => ({
        profile: formateActor(c),
        // roleAs: c.roleAs,
        // leadActor: c.leadActor,
      })),
    },
  });
};

export const searchMovies = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) return sendError(res, "Invalid requests!");
  const movies = await Movie.find({ title: { $regex: title, $options: "i" } });

  const results = movies.map((m) => ({
    id: m._id,
    title: m.title,
    poster: m.poster?.url,
    genres: m.genres,
    status: m.status,
  }));

  res.json({ results });
};

export const getLatestUploads = async (req, res) => {
  const { limit = 5 } = req.query;

  const results = await Movie.find({ status: "public" }).sort("-createdAt").limit(parseInt(limit));

  const movies = results.map((m) => ({
    id: m._id,
    title: m.title,
    storyLine: m.storyLine,
    poster: m.poster?.url,
    responsivePosters: m.poster.responsive,
    video: m.video?.url,
  }));

  res.json({ movies });
};

export const getSingleMovie = async (req, res) => {
  const { movieId } = req.params;

  // // if use 'movieId', need to parse it to ObjectId
  // mongoose.Types.ObjectId(movieId)

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id!");

  const movie = await Movie.findById(movieId).populate("director writer cast");

  // const [aggregatedResponse] = await Review.aggregate(
  //   averageRatingPipeline(movie._id)
  // );

  // const reviews = {};

  // if (aggregatedResponse) {
  //   const { ratingAvg, reviewCount } = aggregatedResponse;
  //   reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1);
  //   reviews.reviewCount = reviewCount;
  // }

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
      poster: poster?.url,
      video: video?.url,
      cast: cast.map((c) => ({
        id: c._id,
        // profile: {
        // id: c.actor._id,
        name: c.name,
        avatar: c.avatar?.url,
        // },
        // leadActor: c.leadActor,
        // roleAs: c.roleAs,
      })),
      writer: {
        id: writer._id,
        name: writer.name,
      },
      director: {
        id: director._id,
        name: director.name,
      },
      reviews,
      // reviews: { ...reviews },
    },
  });
};

export const getRelatedMovies = async (req, res) => {
  const { movieId } = req.params;
  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie id!");

  const movie = await Movie.findById(movieId);

  const movies = await Movie.aggregate(relatedMovieAggregation(movie.tags, movie._id));
  // console.log('controllers-movie: ', movies);

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);
    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews,
      // reviews: { ...reviews },
    };
  };
  const relatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: relatedMovies });
};

export const getTopRatedMovies = async (req, res) => {
  const { genre } = req.query;

  const movies = await Movie.aggregate(topRatedMoviesPipeline(genre));

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster,
      responsivePosters: m.responsivePosters,
      reviews,
    };
  };
  const topRatedMovies = await Promise.all(movies.map(mapMovies));

  res.json({ movies: topRatedMovies });
};

export const searchPublicMovies = async (req, res) => {
  const { title } = req.query;

  if (!title.trim()) return sendError(res, "Invalid requests!");
  const movies = await Movie.find({
    title: { $regex: title, $options: "i" },
    status: "public",
  });

  const mapMovies = async (m) => {
    const reviews = await getAverageRatings(m._id);

    return {
      id: m._id,
      title: m.title,
      poster: m.poster?.url,
      responsivePosters: m.poster?.responsive,
      reviews,
    };
  };
  const results = await Promise.all(movies.map(mapMovies));

  res.json({
    results,
  });
};
