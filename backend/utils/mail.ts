import nodemailer from "nodemailer";
import { TransportOptions } from "nodemailer";

export const generateOTP = (otp_length = 4) => {
  let OTP = "";
  for (let i = 1; i <= otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
  return OTP;
};

export const generateMailTransporter = () => {
  // CORRECTED: Build the transport options dynamically
  const transportOptions: TransportOptions = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '1025'),
    secure: false, // Necessary for MailHog
  };

  // Only add the 'auth' object if user and pass are provided in .env
  // For MailHog, they are empty, so 'auth' will be omitted.
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transportOptions.auth = {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    };
  }

  return nodemailer.createTransport(transportOptions);
};