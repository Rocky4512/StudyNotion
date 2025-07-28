import { User } from "../models/user.models.js";
import { Otp } from "../models/otp.models.js";
import otpGenerator from "otp-generator";
import { Profile } from "../models/profile.models.js";
import { mailSender } from "../utils/mail.js";
import { passwordUpdated } from "../mail/templates/passwordUpdate.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

// Send Otp
const sendOtp = async (req, res) => {
  try {
    //fetch email from request ki body
    const { email } = req.body;

    // check if user already exists
    const checkUserPresent = await User.findOne({ email });
    // if user already exists , then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User already Registered",
      });
    }

    // generate otp
    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    // console.log("Otp generated", otp);

    // check unique otp or not
    let result = await Otp.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await Otp.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };

    // create an entry for Otp in DB
    const otpBody = await Otp.create(otpPayload);
    // otpBody.save();
    // console.log(otpBody);

    // return response successful
    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const signUp = async (req, res) => {
  try {
    // data fetch from req ki body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;
    // validate krlo
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2 password ko match krlo
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password doesn't match",
      });
    }

    // check user already exists or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is already registered",
      });
    }

    // find most recent otp for the user
    const recentOtp = await Otp.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    // console.log(recentOtp);
    // validate the otp
    if (recentOtp.length == 0) {
      return res.status(400).json({
        success: false,
        message: "Otp not found",
      });
    } else if (otp !== recentOtp[0].otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid Otp",
      });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // entry Create in Db

    // Create the Additional Profile For User
    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}%20${lastName}`,
    });
    // return res
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not Registered with Us Please SignUp to Continue",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    // Generate token (if using JWT)
    const payload = {
      id: user._id,
      email: user.email,
      accountType: user.accountType,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    // Save token to user document in database
    user.token = token;
    await user.save();
    user.password = undefined; // Remove password from user object
    // create cookie
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
      httpOnly: true,
    };
    res.cookie("token", token, options);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    // Get old password, new password, and confirm new password from req.body
    const { oldPassword, newPassword } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password,
    );
    if (!isPasswordMatch) {
      // If old password does not match, return a 401 (Unauthorized) error
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    // Update password
    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true },
    );

    // Send notification email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`,
        ),
      );
      // console.log("Email sent successfully:", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    // Return success response
    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

export { sendOtp, signUp, login, changePassword };