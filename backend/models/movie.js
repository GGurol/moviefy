const mongoose = require('mongoose');
const genres = require('../utils/genres');

const movieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      require: true,
    },
    storyLine: {
      type: String,
      trim: true,
      require: true,
    },
    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
    },
    releseDate: {
      type: Date,
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: ['public', 'private'],
    },
    type: {
      type: String,
      require: true,
    },
    genres: {
      type: [String],
      require: true,
      enum: genres,
    },
    tags: {
      type: [String],
      require: true,
    },
    cast: [
      {
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'Actor' },
        roleAs: String,
        leadActor: Boolean,
      },
    ],
    writers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
      },
    ],
    poster: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      responsive: [URL],
      required: true,
    },
    trailer: {
      type: Object,
      url: { type: String, required: true },
      public_id: { type: String, required: true },
      required: true,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    language: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;

// module.exports = mongoose.model('Movie', movieSchema);
