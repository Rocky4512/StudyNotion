    import { User } from "../models/user.models.js";
    import { mailSender } from "../utils/mail.js";
    import crypto from "crypto";
    import bcrypt from "bcryptjs";
    import dotenv from "dotenv";
    import { passwordUpdated } from "../mail/templates/passwordUpdate.js";
    
    dotenv.config({
    path: "./.env",
    });

    // reset password token

    const resetPasswordToken = async (req, res) => {
    try {
        // get email from body
        const { email } = req.body;
        if (!email) {
        return res.status(400).json({
            success: false,
            message: "Email is required",
        });
        }
        // check if user exists linked to this email
        const user = await User.findOne({ email });
        if (!user) {
        return res.status(400).json({
            success: false,
            message: "User not found",
        });
        }
        // generate token
        const token = crypto.randomBytes(32).toString("hex");
        // update user by adding token and expiry time
        user.resetPasswordToken = token;
        user.resetPasswordExpire = Date.now() + 5 * 60 * 1000; 
        await user.save();
        // send mail
        const url = process.env.CLIENT_URL + `/update-password/${token}`;
        await mailSender(
        email,
        "Reset Password Link",
        `Your Link for email verification is ${url}. Please click this url to reset your password.`,
        );
        // return response
        return res.status(200).json({
        success: true,
        message: `Reset password link sent to ${email}`,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    const resetPassword = async (req, res) => {
    try {
        // data fetch kro
        const { password, confirmPassword, token } = req.body; // frontend se headers me aya hai token
        // validate kro
        if (password !== confirmPassword) {
        return res.status(400).json({
            success: false,
            message: "Passwords doesn't match",
        });
        }
        // get user details from db using token
        const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: Date.now() }, // check if token is not expired
        });
        // if no entry - invalid token or expired token
        if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired token",
        });
        }
        // if yes - update password hash kar ke
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined; // remove token
        user.resetPasswordExpire = undefined; // remove expiry time
        await user.save();
        // return success response
        return res.status(200).json({
        success: true,
        message: "Password reset successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    export { resetPasswordToken, resetPassword };