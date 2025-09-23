import express from "express";
import "express-async-errors";
import morgan from "morgan";
import "dotenv/config";
import "./db";
import { errorHandler } from "./middlewares/error";
import cors from "cors";
import { handleNotFound } from "./utils/helper";
import userRouter from "./routes/user";
import actorRouter from "./routes/actor";
import movieRouter from "./routes/movie";
import reviewRouter from "./routes/review";
import adminRouter from "./routes/admin";
import path from "path";
import { fileURLToPath } from "url"; // Import this helper

// --- ADDED: ES Module-compatible way to get __dirname ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// This line will now work correctly
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);

app.use("/*", handleNotFound);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log("the port is listening on port " + PORT);
  console.log("current environment is: " + process.env.NODE_ENV);
});