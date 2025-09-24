import mongoose from "mongoose";
import { createDefaultAdminIfNeeded } from "./seed"; // Import the seeder function

let dsn = process.env.MONGO_URI!;

if (process.env.NODE_ENV === "production") {
  dsn = process.env.CLOUD_MONGO_URI!;
}

mongoose
  .connect(dsn)
  .then(() => {
    console.log("db is connected");
    // Call the function to create the default admin if it doesn't exist
    createDefaultAdminIfNeeded();
  })
  .catch((err) => {
    console.log("db connection failed", err);
  });