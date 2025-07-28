    import { Section } from "../models/section.models.js";
    import { Course } from "../models/course.models.js";
    import { SubSection } from "../models/subSection.models.js";
    import { populate } from "dotenv";

export const createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;
        // console.log("📥 Request Body:", { sectionName, courseId });

        if (!sectionName || !courseId) {
        // console.log("❌ Missing sectionName or courseId");
        return res.status(400).json({ message: "All fields are required" });
        }

        // console.log("🟩 Creating new section...");
        const newSection = await Section.create({ sectionName });
        console.log("✅ Section created:", newSection);

        // console.log("🟩 Adding section to course...");
        const updatedCourseDetails = await Course.findByIdAndUpdate(
        courseId,
        {
            $push: { courseContent: newSection._id },
        },
        { new: true }
        )
        .populate({
            path: "courseContent",
            populate: {
            path: "subSection",
            },
        })
        .exec();

        console.log("✅ Updated course:", updatedCourseDetails);

        // 🟩 Step 5: Return success response
        res.status(201).json({
        success: true,
        message: "Section created successfully",
        section: newSection,
        course: updatedCourseDetails,
        });

    } catch (error) {
        // 🛑 Step 6: Catch and log errors
        console.log("🔥 Error in createSection:", error.message);
        res.status(500).json({
        success: false,
        message: "Unable to create section, Please try again",
        error: error.message,
        });
    }
};


    export const updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId, courseId } = req.body;


        // validate Input
        if (!sectionName || !sectionId) {
        return res.status(400).json({ message: "All fields are required" });
        }
        // update data
        const updatedSection = await Section.findByIdAndUpdate(
        sectionId,
        { sectionName },
        { new: true },
        );

        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
            path: "subSection",
            },
        })
        .exec();

        return res.status(200).json({
        success: true,
        message: "Section updated successfully",
        section: updatedSection,
        data: course,
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Unable to update section , Please try again",
        error: error.message,
        });
    }
    };

    export const deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;
        await Course.findByIdAndUpdate(courseId, {
        $pull: {
            courseContent: sectionId,
        },
        });
        const section = await Section.findById(sectionId);
        // console.log(sectionId, courseId);
        if (!section) {
        return res.status(404).json({
            success: false,
            message: "Section not Found",
        });
        }

        //delete sub section
        await SubSection.deleteMany({ _id: { $in: section.subSection } });

        await Section.findByIdAndDelete(sectionId);

        //find the updated course and return
        const course = await Course.findById(courseId)
        .populate({
            path: "courseContent",
            populate: {
            path: "subSection",
            },
        })
        .exec();

        res.status(200).json({
        success: true,
        message: "Section deleted",
        data: course,
        });
    } catch (error) {
        console.error("Error deleting section:", error);
        res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
    };