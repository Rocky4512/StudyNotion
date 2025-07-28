    import jwt from "jsonwebtoken";
    import dotenv from "dotenv";
    import { User } from "../models/user.models.js";
    import { Profile } from "../models/profile.models.js";

    dotenv.config({
    path: "./.env",
    });

    // This function is used as middleware to authenticate user requests
    const auth = async (req, res, next) => {
    try {
        // Extracting JWT from request cookies, body or header
        const token =
        req.cookies.token ||
        req.headers["authorization"]?.replace("Bearer ", "").trim() ||
        req.body.token;
        // If JWT is missing, return 401 Unauthorized response
        if (!token) {
        return res.status(401).json({
            success: false,
            message: "Token is missing",
        });
        }
        // Verifying the JWT using the secret key stored in environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Storing the decoded JWT payload in the request object for further use
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
        success: false,
        message: "Unauthorized",
        });
    }
    };

    // isStudent
    const isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
        return res.status(401).json({
            success: false,
            message: "This is protected route for Students Only",
        });
        }
        next();
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "User Role Can't be Verified",
        });
    }
    };

    // isInstructor
    const isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
        return res.status(401).json({
            success: false,
            message: "This is protected route for Instructor Only",
        });
        }
        next();
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "User Role Can't be Verified",
        });
    }
    };

    // isAdmin
    const isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
        return res.status(401).json({
            success: false,
            message: "This is protected route for Admin Only",
        });
        }
        next();
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "User Role Can't be Verified",
        });
    }
    };

    export { auth, isStudent, isInstructor, isAdmin };