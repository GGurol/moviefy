import mongoose from "mongoose";

let dsn = process.env.MONGO_URI!;

if (process.env.NODE_ENV === "production") {
  dsn = process.env.CLOUD_MONGO_URI!;
}

mongoose
  .connect(dsn)
  .then(() => {
    console.log("db is connected");
  })
  .catch((err) => {
    console.log("db connection failed", err);
  });
