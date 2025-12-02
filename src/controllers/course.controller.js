const Course = require("../models/course.model.js");
const { uploadOnCloudinary } = require("../utils/cloudinary");

const createCourse = async (req, res) => {
  try {
    const { title, description, category, price, introURL, driveLink } =
      req.body;

    // Thumbnail (optional)
    const thumbnailLocalPath = req.file?.path;

    let thumbnailURL = "https://tinyurl.com/ypz2spcb"; // ⭐ Default thumbnail

    // If user uploads image → upload to Cloudinary
    if (thumbnailLocalPath) {
      const uploadedThumbnail = await uploadOnCloudinary(thumbnailLocalPath);

      if (!uploadedThumbnail || !uploadedThumbnail.url) {
        return res.status(500).json({
          success: false,
          message: "Thumbnail upload failed!",
        });
      }

      thumbnailURL = uploadedThumbnail.url;
    }

    // Validate string fields
    const requiredStringFields = [
      title,
      description,
      category,
      introURL,
      driveLink,
    ];

    if (requiredStringFields.some((field) => !field || field.trim() === "")) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!",
      });
    }

    // Validate price
    if (price === undefined || price === null || isNaN(price)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid number",
      });
    }

    const createNewCourse = new Course({
      thumbnail: thumbnailURL, // ⭐ Cloudinary URL or Default Image
      title,
      description,
      category,
      price,
      introURL,
      driveLink,
    });

    await createNewCourse.save();

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: createNewCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });

    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Empty Cources",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching courses",
      error: error.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      thumbnail,
      title,
      description,
      category,
      price,
      introURL,
      driveLink,
    } = req.body;

    const stringFields = {
      thumbnail,
      title,
      description,
      category,
      introURL,
      driveLink,
    };

    for (const key in stringFields) {
      if (
        stringFields[key] !== undefined &&
        typeof stringFields[key] === "string" &&
        stringFields[key].trim() === ""
      ) {
        return res.status(400).json({
          success: false,
          message: `${key} cannot be an empty string`,
        });
      }
    }

    if (price !== undefined && (isNaN(price) || price < 0)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a valid positive number",
      });
    }

    const updateData = {
      ...(thumbnail !== undefined && { thumbnail }),
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(category !== undefined && { category }),
      ...(price !== undefined && { price }),
      ...(introURL !== undefined && { introURL }),
      ...(driveLink !== undefined && { driveLink }),
    };

    const updatedCourse = await Course.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating course",
      error: error.message,
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting course",
      error: error.message,
    });
  }
};
module.exports = {
  createCourse,
  getCourses,
  updateCourse,
  deleteCourse,
};
