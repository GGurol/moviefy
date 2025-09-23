import mongoose from "mongoose";

const actorSchema = new mongoose.Schema(
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
    // CORRECTED: Avatar is now a simple String to store the local file path
    avatar: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

actorSchema.index({ name: "text" });

export default mongoose.model("Actor", actorSchema);