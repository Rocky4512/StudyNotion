    import { Profile } from "../models/profile.models.js";
    import { User } from "../models/user.models.js";
    import { CourseProgress } from "../models/courseProgress.js";
    import { Course } from "../models/course.models.js";
    import { convertSecondsToDuration } from "../utils/convertSecToDuration.js";
    import { uploadImageToCloudinary } from "../utils/imageUploader.js";

    export const updateProfile = async (req, res) => {
    try {
        // get data
        const {
        firstName,
        lastName,
        dateOfBirth = "",
        about = "",
        contactNumber = "",
        gender = "",
        } = req.body;
        // get user Id
        const id = req.user.id;
        // validation
        if (!id || !about || !contactNumber) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
        }
        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        const user = await User.findByIdAndUpdate(id, {
        firstName,
        lastName,
        });
        await user.save();
        // update profile
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;

        await profileDetails.save();

        // Find the updated user details
        const updatedUserDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec();

        // return response
        return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        updatedUserDetails,
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
        success: false,
        message: "Unable to update profile",
        error: error.message,
        });
    }
    };

    // delete account
    export const deleteAccount = async (req, res) => {
    try {
        // get id
        const id = req.user.id;

        const userDetails = await User.findById(id);

        if (!userDetails) {
        return res.status(404).json({
            success: false,
            message: "User not found",
        });
        }

        //delete profile
        await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
        //TODO:Unenroll user from all enrolled courses
        for (const courseId of userDetails.courses) {
        await Course.findByIdAndUpdate(
            courseId,
            { $pull: { studentsEnrolled: id } },
            { new: true },
        );
        }
        //delete user
        await User.findByIdAndDelete({ _id: id });
        await CourseProgress.deleteMany({ userId: id });
        return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: "Unable to delete account",
        error: error.message,
        });
    }
    };

    export const getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id = req.user.id;
        //validate and get user details
        const userDetails = await User.findById(id)
        .populate("additionalDetails")
        .exec();
        // return response
        return res.status(200).json({
        success: true,
        message: "User data fetched successfully",
        data: userDetails,
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    export const updateDisplayPicture = async (req, res) => {
    try {

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);
        if (!req.files || !req.files.displaypicture) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }
        const displayPicture = req.files.displaypicture;
        const userId = req.user.id;
        const image = await uploadImageToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000,
        );
        console.log(image);
        const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true },
        );
        res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    export const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        let userDetails = await User.findOne({
        _id: userId,
        })
        .populate({
            path: "courses",
            populate: {
            path: "courseContent",
            populate: {
                path: "subSection",
            },
            },
        })
        .exec();

        userDetails = userDetails.toObject();
        var SubsectionLength = 0;
        for (var i = 0; i < userDetails.courses.length; i++) {
        let totalDurationInSeconds = 0;
        SubsectionLength = 0;
        for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
            totalDurationInSeconds += userDetails.courses[i].courseContent[
            j
            ].subSection.reduce(
            (acc, curr) => acc + parseInt(curr.timeDuration),
            0,
            );
            userDetails.courses[i].totalDuration = convertSecondsToDuration(
            totalDurationInSeconds,
            );
            SubsectionLength +=
            userDetails.courses[i].courseContent[j].subSection.length;
        }
        let courseProgressCount = await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
        });
        courseProgressCount = courseProgressCount?.completedVideos.length;
        if (SubsectionLength === 0) {
            userDetails.courses[i].progressPercentage = 100;
        } else {
            // To make it up to 2 decimal point
            const multiplier = Math.pow(10, 2);
            userDetails.courses[i].progressPercentage =
            Math.round(
                (courseProgressCount / SubsectionLength) * 100 * multiplier,
            ) / multiplier;
        }
        }

        if (!userDetails) {
        return res.status(400).json({
            success: false,
            message: `Could not find user with id: ${userDetails}`,
        });
        }
        return res.status(200).json({
        success: true,
        data: userDetails.courses,
        });
    } catch (error) {
        return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
    };

    export const instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id });

        const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentsEnrolled.length;
        const totalAmountGenerated = totalStudentsEnrolled * course.price;

        // Create a new object with the additional fields
        const courseDataWithStats = {
            _id: course._id,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            // Include other course properties as needed
            totalStudentsEnrolled,
            totalAmountGenerated,
        };

        return courseDataWithStats;
        });

        res.status(200).json({ courses: courseData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
    };