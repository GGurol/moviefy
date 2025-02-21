const mongoose = require('mongoose');

// SchemaTypes
const actorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    about: {
      type: String,
      trim: true,
      required: true,
    },
    gender: {
      type: String,
      trim: true,
      required: true,
    },
    avatar: {
      type: Object,
      url: String,
      public_id: String,
    },
  },
  { timestamps: true }
);

// Text Index
actorSchema.index({ name: 'text' });

module.exports = mongoose.model('Actor', actorSchema);
