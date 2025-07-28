import { Router } from "express";
const router = Router();
import { auth, isInstructor } from "../middleware/authmiddleware.js";

import {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard,
} from "../controller/profilecontroller.js";

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);
router.put("/updateProfile", auth, updateProfile);
router.get("/getUserDetails", auth, getAllUserDetails);
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateDisplayPicture", auth, updateDisplayPicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

export default router;