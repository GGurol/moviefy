import jwt from "jsonwebtoken";
import { sendError } from "../utils/helper";
import User from "../models/user";

export const isAuth = async (req, res, next) => {
  const token = req.headers?.authorization;

  if (!token) return sendError(res, "Invalid token");
  const jwtToken = token.split("Bearer ")[1];

  if (!jwtToken) return sendError(res, "Invalid token");
  const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
  // console.log('decode: ', decode);
  const { userId } = decode;

  const user = await User.findById(userId);
  if (!user) return sendError(res, "Invalid token, user not found", 404); // Trans

  req.user = user;

  next();
};

export const isAdmin = (req, res, next) => {
  const { user } = req;
  if (user.role !== "admin") return sendError(res, "Only administrators can perform this action"); // Trans
  next();
};
