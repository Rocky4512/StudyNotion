import { Category } from "../models/category.models.js";
import mongoose from "mongoose";
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// create category ka handler function
const createCategory = async (req, res) => {
try {
    const { name, description } = req.body;
    // validate kro
    if (!name || !description) {
    return res.status(400).json({
        success: false,
        message: "All fields are required",
    });
}
    // create category in db
    const category = await Category.create({
            name,
            description,
    });
    // return success response
    return res.status(200).json({
        success: true,
        message: "Category created successfully",
        category,
    });
} catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: error.message,
    });
  }
};

// get all category ka handler function
const showAllCategories = async (req, res) => {
try {
    const allCategory = await Category.find({});
    // return success response
    return res.status(200).json({
        success: true,
        message: "Category fetched successfully",
        data: allCategory,
    });
}catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: error.message,
        });
    }
};

const categoryPageDetails = async (req, res) => {
try {
    const { categoryId } = req.body;
    // console.log("PRINTING CATEGORY ID: ", categoryId);
    // Get courses for the specified category
    const selectedCategory = await Category.findById(categoryId)
    .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
    })
    .exec();

    //console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
    console.log("Category not found.");
    return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      // console.log("No courses found for the selected category.");
    return res.status(404).json({
        success: false,
        message: "No courses found for the selected category.",
    });
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Category.find({
    _id: { $ne: categoryId },
    });
    let differentCategory = await Category.findOne(
    categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id,
    )
    .populate({
        path: "courses",
        match: { status: "Published" },
    })
    .exec();
    //console.log("Different COURSE", differentCategory)
    // Get top-selling courses across all categories
    const allCategories = await Category.find()
    .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
        path: "instructor",
        },
    })
    .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 10);
    // console.log("mostSellingCourses COURSE", mostSellingCourses)
    res.status(200).json({
        success: true,
        data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
        },
    });
} catch (error) {
    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
    });
    }
};

export { createCategory, showAllCategories, categoryPageDetails };