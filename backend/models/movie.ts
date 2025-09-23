import mongoose from "mongoose";
import genres from "../utils/genres";

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true, // Corrected from 'require'
    },
    storyLine: {
      type: String,
      trim: true,
      required: true, // Corrected from 'require'
    },
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
    releaseDate: {
      type: Date,
      required: true, // Corrected from 'require'
    },
    status: {
      type: String,
      required: true, // Corrected from 'require'
      enum: ["public", "private"],
    },
    type: {
      type: String,
      required: true, // Corrected from 'require'
    },
    genres: {
      type: [String],
      required: true, // Corrected from 'require'
      enum: genres,
    },
    tags: {
      type: [String],
      required: true, // Corrected from 'require'
    },
    cast: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actor",
      },
    ],
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actor",
    },
    // CORRECTED: Poster is now a simple String to store the local file path
    poster: {
      type: String,
      trim: true,
      required: true,
    },
    // CORRECTED: Video is now a simple String to store the local file path
    video: {
      type: String,
      trim: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    language: {
      type: String,
      required: true, // Corrected from 'require'
    },
  },
  { timestamps: true }
);

export default mongoose.model("Movie", movieSchema);