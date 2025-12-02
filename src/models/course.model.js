const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    category: {
      type: String,
      enum: [
        "Technology",
        "Business",
        "Education",
        "Health & Fitness",
        "Arts & Culture",
        "Sports",
        "Entertainment",
        "Finance",
        "Lifestyle",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: [true, "Course price is required"],
      min: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    enrollments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    IntroURL: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
