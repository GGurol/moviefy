const jwt = require('jsonwebtoken');
const User = require('../models/user');
const EmailVerificationToken = require('../models/emailVerificationToken');
const PasswordResetToken = require('../models/passwordResetToken');
const { isValidObjectId } = require('mongoose');
const {
    generateOTP,
    generateMailTransporter,
    sendEmail,
} = require('../utils/mail');
const { sendError, generateRandomByte } = require('../utils/helper');

exports.create = async (req, res) => {
    // console.log(req.body);
    // without app.use(express.json()) middleware, req.body will be undefined
    const { name, email, password } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser)
        // return res.status(401).json({ error: 'This email is already in use!' });
        return sendError(res, 'This email is already in use!');

    const newUser = new User({ name, email, password });
    await newUser.save();

    // generate 6 digit otp
    let OTP = generateOTP();

    // store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: newUser._id,
        token: OTP,
    });
    await newEmailVerificationToken.save();

    // send that otp to our user
    const transport = generateMailTransporter();

    transport.verify((error, success) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Server is ready to take our messages');
        }
    });

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: newUser.email,
        subject: 'Email Verification',
        html: `
      <p>Your verification OTP</p>
      <h1>${OTP}</h1>
      `,
    });

    //     let htmlContent = `
    //   <p>Your verification OTP</p>
    //   <h1>${OTP}</h1>
    //   `;

    //     await sendEmail(
    //         newUser.name,
    //         newUser.email,
    //         'Email Verification',
    //         htmlContent
    //     );

    res.status(201).json({
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        },
    });
};

exports.verifyEmail = async (req, res) => {
    const { userId, OTP } = req.body;

    if (!isValidObjectId(userId))
        return res.json({ error: 'Invalid User Id!' });

    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found!', 404);
    if (user.isVerified) return sendError(res, 'User is already verified!');

    const token = await EmailVerificationToken.findOne({ owner: userId });
    if (!token) return sendError(res, 'Token not found!');

    const isMatched = await token.compareToken(OTP);
    if (!isMatched) return sendError(res, 'Invalid OTP!');

    user.isVerified = true;
    await user.save();

    await EmailVerificationToken.findByIdAndDelete(token._id);

    const transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Welcome Email ',
        html: `
    <h1>Welcome to our app and thanks for choosing us.</h1>
    `,
    });

    //     const htmlContent = `
    //     <h1>Welcome to our app and thanks for choosing us.</h1>
    //   `;

    //     await sendEmail(user.name, user.email, 'Welcome Message', htmlContent);

    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            token: jwtToken,
            isVerified: user.isVerified,
            role: user.role,
        },
        message: 'User is verified!',
    });
};

exports.resendEmailVerificationToken = async (req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return sendError(res, 'User not found!');

    if (user.isVerified) return sendError(res, 'User is already verified!');

    const alreadyHasToken = await EmailVerificationToken.findOne({
        owner: userId,
    });
    if (alreadyHasToken)
        return sendError(
            res,
            'Only after one hour you can request for another token'
        );

    // generate 6 digit otp
    let OTP = generateOTP();

    // store otp inside our db
    const newEmailVerificationToken = new EmailVerificationToken({
        owner: user._id,
        token: OTP,
    });
    await newEmailVerificationToken.save();

    // send that otp to our user
    const transport = generateMailTransporter();

    transport.sendMail({
        from: 'verification@reviewapp.com',
        to: user.email,
        subject: 'Email Verification',
        html: `
    <p>Your verification OTP</p>
    <h1>${OTP}</h1>
    `,
    });

    //     let htmlContent = `
    //     <p>Your verification OTP</p>
    //     <h1>${OTP}</h1>
    //   `;

    //     await sendEmail(user.name, user.email, 'Email Verification', htmlContent);

    res.json({
        message: 'New OTP has been sent to your email!',
    });
};

exports.forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return sendError(res, 'Email is required!');
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 'User not found!', 404);

    const alreadyHasToken = await PasswordResetToken.findOne({
        owner: user._id,
    });
    if (alreadyHasToken)
        return sendError(
            res,
            'Only after one hour you can request for another token'
        );

    const token = await generateRandomByte();
    const newPasswordResetToken = await new PasswordResetToken({
        owner: user._id,
        token,
    });
    await newPasswordResetToken.save();

    // const resetPasswordUrl = `http://localhost:5173/auth/reset-password?token=${token}&id=${user._id}`;
    let resetPasswordUrl = `${process.env.RESET_PASSWORD_URL}/auth/reset-password?token=${token}&id=${user._id}`;

    const transport = generateMailTransporter();

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: user.email,
        subject: 'Reset Password Link',
        html: `
    <p>Click here to reset password</p>
    <a href="${resetPasswordUrl}">Reset Password</a>
    `,
    });

    //     let htmlContent = `
    //      <p>Click here to reset password</p>
    //      <a href="${resetPasswordUrl}">Reset Password</a>
    //   `;

    //     await sendEmail(user.name, user.email, 'Forget Password', htmlContent);

    res.json({
        message: 'Reset password link has been sent to your email!',
    });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
    res.json({ valid: true });
};

exports.resetPassword = async (req, res) => {
    const { newPassword, userId } = req.body;

    const user = await User.findById(userId);
    const matched = await user.comparePassword(newPassword);
    if (matched)
        return sendError(
            res,
            'New password must be different from old password!'
        );

    user.password = newPassword;
    await user.save();

    await PasswordResetToken.findByIdAndDelete(req.resetToken._id);

    const transport = generateMailTransporter();

    transport.sendMail({
        from: 'security@reviewapp.com',
        to: user.email,
        subject: 'Password Reset Successfully',
        html: `
    <h1>Password Reset Successfully</h1>
    <p>Now you can use your new password.</p>
    `,
    });

    //     const htmlContent = `
    //     <h1>Password Reset Successfully</h1>
    //     <p>Now you can use your new password.</p>
    //  `;

    //     await sendEmail(user.name, user.email, 'Password Changed', htmlContent);

    res.json({ message: 'Password reset successfully!' });
};

exports.signIn = async (req, res, next) => {
    const { email, password } = req.body;

    // try {
    const user = await User.findOne({ email });
    if (!user) return sendError(res, 'Email/Password is incorrect!');

    const matched = await user.comparePassword(password);
    if (!matched) return sendError(res, 'Email/Password mismatch!');

    const { _id, name, role, isVerified } = user;

    const jwtToken = jwt.sign({ userId: _id }, process.env.JWT_SECRET);

    res.json({
        user: { id: _id, name, email, role, token: jwtToken, isVerified },
    });
    // } catch (error) {
    //   next(error.message);
    // }
};
