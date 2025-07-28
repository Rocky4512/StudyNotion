    import { SubSection } from "../models/subSection.models.js";
    import { Section } from "../models/section.models.js";
    import { uploadImageToCloudinary } from "../utils/imageUploader.js";

    export const createSubSection = async (req, res) => {
    try {
        //fetch data
        const { sectionId, title, description } = req.body
        //extract file/video
        const video = req.files.video;
        // validation
        if (!sectionId || !title || !description || !video) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
        }
        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME,
        );
        // Create a new sub-section with the necessary information
        const subSectionDetails = await SubSection.create({
        title: title,
        timeDuration: `${uploadDetails.duration}`,
        description: description,
        videoUrl: uploadDetails.secure_url,
        })
        // update section with this subsection object ID
        const updatedSection = await Section.findByIdAndUpdate(
        { _id: sectionId },
        { $push: { subSection: subSectionDetails._id } },
        { new: true },
        ).populate("subSection");
        // console.log(updatedSection);
        //return response
        return res.status(201).json({
        success: true,
        message: "Subsection created successfully",
        data:updatedSection,
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Unable to create subsection, Please try again",
        error: error.message,
        });
    }
    };

    export const updateSubSection = async (req, res) => {
    try {
        const { sectionId, subSectionId, title, description } = req.body;
        const subSection = await SubSection.findById(subSectionId);

        if (!subSection) {
        return res.status(404).json({
            success: false,
            message: "SubSection not found",
        });
        }

        if (title !== undefined) {
        subSection.title = title;
        }

        if (description !== undefined) {
        subSection.description = description;
        }
        if (req.files && req.files.video !== undefined) {
        const video = req.files.video;
        const uploadDetails = await uploadImageToCloudinary(
            video,
            process.env.FOLDER_NAME,
        );
        subSection.videoUrl = uploadDetails.secure_url;
        subSection.timeDuration = `${uploadDetails.duration}`;
        }

        await subSection.save();

        // find updated section and return it
        const updatedSection =
        await Section.findById(sectionId).populate("subSection");

        // console.log("updated section", updatedSection);

        return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
        });
    }
    };

    export const deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;
        await Section.findByIdAndUpdate(
        { _id: sectionId },
        {
            $pull: {
            subSection: subSectionId,
            },
        },
        );
        const subSection = await SubSection.findByIdAndDelete({
        _id: subSectionId,
        });

        if (!subSection) {
        return res
            .status(404)
            .json({ success: false, message: "SubSection not found" });
        }

        // find updated section and return it
        const updatedSection =
        await Section.findById(sectionId).populate("subSection");

        return res.json({
        success: true,
        message: "SubSection deleted successfully",
        data: updatedSection,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the SubSection",
        });
    }
    };