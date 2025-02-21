import express from "express";
import {
  create,
  verifyEmail,
  resendEmailVerificationToken,
  forgetPassword,
  sendResetPasswordTokenStatus,
  resetPassword,
  signIn,
} from "../controllers/user";
import { userValidator, validate, validatePassword, signInValidator } from "../middlewares/validator";
import { isValidPassResetToken } from "../middlewares/user";
import { sendError } from "../utils/helper";
import { isAuth } from "../middlewares/auth";

const router = express.Router();

router.post("/create", userValidator, validate, create);
router.post("/sign-in", signInValidator, validate, signIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post("/forget-password", forgetPassword);
router.post("/verify-pass-reset-token", isValidPassResetToken, sendResetPasswordTokenStatus);
router.post("/reset-password", validatePassword, validate, isValidPassResetToken, resetPassword);

router.get("/is-auth", isAuth, (req, res) => {
  const { user } = req;
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      role: user.role,
    },
  });
});

export default router;
