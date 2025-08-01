    import { Router } from "express";
    const router = Router();

    // course controllers import
    import {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
    } from "../controller/coursecontroller.js";

    //category controller import
    import {
    showAllCategories,
    createCategory,
    categoryPageDetails,
    } from "../controller/categorycontroller.js";

    // section controllers import
    import {
    createSection,
    updateSection,
    deleteSection,
    } from "../controller/sectioncontroller.js";

    //sub-section controllers import
    import {
    createSubSection,
    updateSubSection,
    deleteSubSection,
    } from "../controller/subSectioncontroller.js";

    // rating controllers import
    import {
    createRating,
    getAverageRating,
    getAllRating,
    } from "../controller/ratingAndReview.js";

    // course progress update
    import { updateCourseProgress } from "../controller/courseProgresscontroller.js";

    // middlewares import
    import {
    auth,
    isInstructor,
    isStudent,
    isAdmin,
    } from "../middleware/authmiddleware.js";

    // ********************************************************************************************************
    //                                      Course routes
    // ********************************************************************************************************

    // Courses can Only be Created by Instructors
    router.post("/createCourse", auth, isInstructor, createCourse);
    //Add a Section to a Course
    router.post("/addSection", auth, isInstructor, createSection);
    // Update a Section
    router.post("/updateSection", auth, isInstructor, updateSection);
    // Delete a Section
    router.post("/deleteSection", auth, isInstructor, deleteSection);
    // Edit Sub Section
    router.post("/updateSubSection", auth, isInstructor, updateSubSection);
    // Delete Sub Section
    router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);
    // Add a Sub Section to a Section
    router.post("/addSubSection", auth, isInstructor, createSubSection);
    // Get all Registered Courses
    router.get("/getAllCourses", getAllCourses);
    // Get Details for a Specific Courses
    router.post("/getCourseDetails", getCourseDetails);
    // Get Details for a Specific Courses
    router.post("/getFullCourseDetails", auth, getFullCourseDetails);
    // Edit Course routes
    router.post("/editCourse", auth, isInstructor, editCourse);
    // Get all Courses Under a Specific Instructor
    router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
    // Delete a Course
    router.delete("/deleteCourse", deleteCourse);
    // mark as complete route
    router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

    // ********************************************************************************************************
    //                                      Category routes (Only by Admin)
    // ********************************************************************************************************
    // Category can Only be Created by Admin
    // TODO: Put IsAdmin Middleware here
    router.post("/createCategory", auth, isAdmin, createCategory);
    router.get("/showAllCategories", showAllCategories);
    router.post("/getCategoryPageDetails", categoryPageDetails);

    // ********************************************************************************************************
    //                                      Rating and Review
    // ********************************************************************************************************
    router.post("/createRating", auth, isStudent, createRating);
    router.get("/getAverageRating", getAverageRating);
    router.get("/getReviews", getAllRating);

    export default router;