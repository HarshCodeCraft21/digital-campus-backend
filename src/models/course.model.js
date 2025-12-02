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
        "Others"
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
      default:"https://tinyurl.com/ypz2spcb"
    },
    enrollments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    introURL: {
      type: String,
      lowercase: true,
    },
    driveLink: {
      type: String,
      lowercase: true,
      required: [true, "Enter your drive link"],
      validate: {
        validator: function (value) {
          const driveRegex =
            /^(https?:\/\/)?(drive\.google\.com\/)(file\/d\/|open\?id=|drive\/folders\/|drive\/u\/\d\/folders\/).+/;

          return driveRegex.test(value);
        },
        message: "Please enter a valid Google Drive link",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
