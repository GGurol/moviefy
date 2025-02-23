import nodemailer from "nodemailer";
import SibApiV3Sdk from "sib-api-v3-sdk";

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

// export const sendEmail = async (name, email, subject, htmlContent) => {
//     let defaultClient = SibApiV3Sdk.ApiClient.instance;

//     // Configure API key authorization: api-key
//     let apiKey = defaultClient.authentications['api-key'];
//     apiKey.apiKey = process.env.BREVO_API_KEY;

//     // Uncomment below two lines to configure authorization using: partner-key
//     // let  partnerKey = defaultClient.authentications['partner-key'];
//     // partnerKey.apiKey = 'YOUR API KEY';

//     let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//     let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail(); // SendSmtpEmail | Values to send a transactional email

//     sendSmtpEmail = {
//         to: [
//             {
//                 email,
//                 name,
//             },
//         ],
//         templateId: 59,
//         subject: subject,
//         htmlContent: htmlContent,
//         sender: {
//             name: 'Movie Review App',
//             email: process.env.OFFICIAL_EMAIL,
//         },
//         // params: {
//         //     name: 'John',
//         //     surname: 'Doe',
//         // },
//         // headers: {
//         //     'X-Mailin-custom':
//         //         'custom_header_1:custom_value_1|custom_header_2:custom_value_2',
//         // },
//     };

//     return await apiInstance.sendTransacEmail(sendSmtpEmail);
// };
