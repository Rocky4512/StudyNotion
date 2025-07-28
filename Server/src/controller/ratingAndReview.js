    import { RatingAndReview } from "../models/ratingAndReview.js";
    import { Course } from "../models/course.models.js";
    import mongoose from "mongoose";

    // createRating
    const createRating = async (req, res) => {
    try {
        // get user id
        const userId = req.user.id;
        // fetch data from req body
        const { rating, review, courseId } = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne({
        _id: courseId,
        studentsEnrolled: { $elemMatch: { $eq: userId } },
        });
        if (!courseDetails) {
        return res.status(404).json({
            success: false,
            message: "Student is not enrolled in the course",
        });
        }
        // check if user already reviewed the course or not
        const alreadyReviewed = await RatingAndReview.findOne({
        user: userId,
        course: courseId,
        });
        if (alreadyReviewed) {
        return res.status(403).json({
            success: false,
            message: "Course is already reviewed by the user",
        });
        }
        // create rating and review
        const ratingReview = await RatingAndReview.create({
        rating,
        review,
        course: courseId,
        user: userId,
        });
        // update course with the rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate(
        { _id: courseId },
        {
            $push: {
            ratingAndReviews: ratingReview._id,
            },
        },
        { new: true },
        );
        // console.log(updatedCourseDetails);
        // return response
        return res.status(200).json({
        success: true,
        message: "Rating and Review created successfully",
        ratingReview,
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    // get average rating
    const getAverageRating = async (req, res) => {
    try {
        // get course id
        const courseId = req.body.courseId;
        // calculate avg rating
        const result = await RatingAndReview.aggregate([
        {
            $match: {
            course: new mongoose.Schema.Types.ObjectId(courseId),
            },
        },
        {
            $group: {
            _id: null,
            averageRating: { $avg: "rating" },
            },
        },
        ]);
        if (result.length > 0) {
        return res.status(200).json({
            success: true,
            averageRating: result[0].averageRating,
        });
        }
        // if no rating/review exists
        return res.json(200).json({
        success: true,
        message: "Average rating is 0 , no ratings given till now",
        averageRating: 0,
        });
        //return rating
    } catch (error) {
        console.error(error);
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    // get all rating
    const getAllRating = async (req, res) => {
    try {
        const allReviews = await RatingAndReview.find({})
        .sort({ rating: "desc" })
        .populate({ path: "user", select: "firstName lastName email image" })
        .populate({ path: "course", select: "courseName" })
        .exec();
        return res.status(200).json({
        success: true,
        message: "All reviews fetched successfully",
        data: allReviews,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    export { createRating, getAverageRating, getAllRating };