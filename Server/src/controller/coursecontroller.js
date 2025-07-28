    import { Course } from "../models/course.models.js";
    import { Category } from "../models/category.models.js";
    import { User } from "../models/user.models.js";
    import { Section } from "../models/section.models.js";
    import { SubSection } from "../models/subSection.models.js";
    import { CourseProgress } from "../models/courseProgress.js";
    import { uploadImageToCloudinary } from "../utils/imageUploader.js";
    import { convertSecondsToDuration } from "../utils/convertSecToDuration.js";
    import { populate } from "dotenv";

    // create course ka handler function
    const createCourse = async (req, res) => {
    try {
        //
        let {
        courseName,
        courseDescription,
        whatYouWillLearn,
        price,
        tag: _tag,
        category,
        status,
        instructions: _instructions,
        } = req.body;
        // const thumbnail = req.files?.thumbnail;
        const thumbnail = req.files.thumbnailImage;

        // Convert the tag and instructions from stringified Array to Array
        const tag = JSON.parse(_tag);
        const instructions = JSON.parse(_instructions);
        // console.log("tag", tag);
        // console.log("instructions", instructions);
        // console.log("courseName",courseName);
        // console.log(courseDescription);
        // console.log(whatYouWillLearn);
        // console.log(price);
        // console.log(category);
        // console.log(status);
        // console.log(thumbnail);

        // validate kro
        if (
        !courseName ||
        !courseDescription ||
        !whatYouWillLearn ||
        !price ||
        !tag.length ||
        !category ||
        !thumbnail ||
        !instructions.length
        ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
        }
        if (!status || status === undefined) {
        status = "Draft";
        }

        //check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId, {
        accountType: "Instructor",
        });
        // console.log("Instructor Details : ", instructorDetails);
        if (!instructorDetails) {
        return res.status(404).json({
            success: false,
            message: "Instructor not found",
        });
        }

        // check for tag
        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
        return res.status(404).json({
            success: false,
            message: "Category not found",
        });
        }

        // upload image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME,
        );
        // console.log(thumbnailImage);

        // create course in db
        const newCourse = await Course.create({
        courseName,
        courseDescription,
        instructor: instructorDetails._id,
        whatYouWillLearn: whatYouWillLearn,
        price,
        tag,
        category: categoryDetails._id,
        thumbnail: thumbnailImage.secure_url,
        status: status,
        instructions,
        });

        // Add the new course to the User Schema of the Instructor
        await User.findByIdAndUpdate(
        instructorDetails._id,
        {
            $push: { courses: newCourse._id },
        },
        { new: true },
        );

        // Add the new course to the Categories
        await Category.findByIdAndUpdate(
        categoryDetails._id,
        {
            $push: { courses: newCourse._id },
        },
        { new: true },
        );

        // return success response
        return res.status(200).json({
        success: true,
        message: "Course created successfully",
        data: newCourse,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    //edit course details
    const editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const updates = req.body;
        const course = await Course.findById(courseId);
        // console.log("PRINTING UPDATES FROM EDIT COURSE API ", updates);
        if (!course) {
        return res.status(404).json({ error: "Course not found" });
        }

        // If Thumbnail Image is found, update it
        if (req.files) {
        // console.log("thumbnail update");
        const thumbnail = req.files.thumbnailImage;
        const thumbnailImage = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME,
        );
        course.thumbnail = thumbnailImage.secure_url;
        }
        // console.log("BEFORE FOR LOOP");
        // Update only the fields that are present in the request body
        Object.keys(updates).forEach((key) => {
        if (key === "tag" || key === "instructions") {
            try {
            course[key] = JSON.parse(updates[key]);
            } catch (err) {
            console.error(`Failed to parse ${key}:`, updates[key]);
            }
        } else {
            course[key] = updates[key];
        }
        });
        // console.log("AFTER FOR LOOP");
        await course.save();

        const updatedCourse = await Course.findOne({
        _id: courseId,
        })
        .populate({
            path: "instructor",
            populate: {
            path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
            path: "subSection",
            },
        })
        .exec();

        res.json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
        });
    }
    };

    // get all courses ka handler function
    const getAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find(
        { status: "Published" },
        {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
        },
        )
        .populate("instructor")
        .exec();

        // return success response
        return res.status(200).json({
        success: true,
        message: "Courses fetched successfully",
        data: allCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    //getCourseDetails
    const getCourseDetails = async (req, res) => {
    try {
        // get id
        const { courseId } = req.body;
        // find course details
        const courseDetails = await Course.findById({ _id: courseId })
        .populate({
            path: "instructor",
            populate: {
            path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
            path: "subSection",
            select: "-videoUrl",
            },
        })
        .exec();
        // validation
        if (!courseDetails) {
        return res.json({
            success: false,
            message: `Could not find the course with id : ${courseId}`,
        });
        }
        let totalDurationInSeconds = 0;
        // console.log(courseDetails);
        courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration);
            totalDurationInSeconds += timeDurationInSeconds;
        });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);
        //return response
        return res.status(200).json({
        success: true,
        message: "Course details fetched successfully",
        data: { courseDetails, totalDuration },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    //get full course details
    const getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;
        const courseDetails = await Course.findOne({
        _id: courseId,
        })
        .populate({
            path: "instructor",
            populate: {
            path: "additionalDetails",
            },
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path: "courseContent",
            populate: {
            path: "subSection",
            },
        })
        .exec();

        let courseProgressCount = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
        });

        // console.log("courseProgressCount : ", courseProgressCount);

        if (!courseDetails) {
        return res.status(400).json({
            success: false,
            message: `Could not find course with id: ${courseId}`,
        });
        }

        // if (courseDetails.status === "Draft") {
        //   return res.status(403).json({
        //     success: false,
        //     message: `Accessing a draft course is forbidden`,
        //   });
        // }

        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration);
            totalDurationInSeconds += timeDurationInSeconds;
        });
        });

        const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

        return res.status(200).json({
        success: true,
        data: {
            courseDetails,
            totalDuration,
            completedVideos: courseProgressCount?.completedVideos
            ? courseProgressCount?.completedVideos
            : [],
        },
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    // get instructor courses
    const getInstructorCourses = async (req, res) => {
    try {
        // Get the instructor ID from the authenticated user or request body
        const instructorId = req.user.id;

        // Find all courses belonging to the instructor
        const instructorCourses = await Course.find({
        instructor: instructorId,
        }).sort({ createdAt: -1 });

        // Return the instructor's courses
        res.status(200).json({
        success: true,
        data: instructorCourses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
        });
    }
    };

    //delete a course
    const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        // Find the course
        const course = await Course.findById(courseId);
        if (!course) {
        return res.status(404).json({ message: "Course not found" });
        }

        // Unenroll students from the course
        const studentsEnrolled = course.studentsEnrolled;
        for (const studentId of studentsEnrolled) {
        await User.findByIdAndUpdate(studentId, {
            $pull: { courses: courseId },
        });
        }

        // Delete sections and sub-sections
        const courseSections = course.courseContent;
        for (const sectionId of courseSections) {
        // Delete sub-sections of the section
        const section = await Section.findById(sectionId);
        if (section) {
            const subSections = section.subSection;
            for (const subSectionId of subSections) {
            await SubSection.findByIdAndDelete(subSectionId);
            }
        }

        // Delete the section
        await Section.findByIdAndDelete(sectionId);
        }

        // Delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
        success: false,
        message: "Server error",
        error: error.message,
        });
    }
    };
    export {
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
    };