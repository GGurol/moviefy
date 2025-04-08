import nodemailer from "nodemailer";

export const generateOTP = (otp_length = 4) => {
  // generate 4 digit otp
  let OTP = "";
  for (let i = 1; i <= otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }
  return OTP;
};

export const generateMailTransporter = () =>
  nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      // user: process.env.MAIL_TRAP_USER,
      // pass: process.env.MAIL_TRAP_PASS,
      user: "1800b43b02b3f4",
      pass: "f73535518eac82",
    },
  });
