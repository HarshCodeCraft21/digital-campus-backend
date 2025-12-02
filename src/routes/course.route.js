const express = require("express");
const {
  createCourse,
  getCourses,
} = require("../controllers/course.controller.js");
const upload = require("../middleware/multer.js");

const { verifyJwt } = require("../middleware/verifyJwt.js");
const router = express.Router();

router
  .route("/create-course")
  .post(upload.single("thumbnail"), verifyJwt, createCourse);

router.route("/courses").get(getCourses);
module.exports = router;
