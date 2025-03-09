import { isValidObjectId } from "mongoose";
import PasswordResetToken from "../models/passwordResetToken";
import { sendError } from "../utils/helper";

export const isValidPassResetToken = async (req, res, next) => {
  const { token, userId } = req.body;

  if (!token.trim() || !isValidObjectId(userId)) return sendError(res, "Invalid request");

  const resetToken = await PasswordResetToken.findOne({ owner: userId });
  if (!resetToken) return sendError(res, "Invalid request");

  const matched = await resetToken.compareToken(token);
  if (!matched) return sendError(res, "Invalid request");

  req.resetToken = resetToken;
  next();
};
