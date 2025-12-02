const crypto = require("crypto");
const razorpay = require("../config/razorpay.js");

const enrollmentModel = require("../models/enrollment.model");
const courseModel = require("../models/course.model");
const userModel = require("../models/user.model");

// 1. Create Payment Order ----------------------------
exports.createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await courseModel.findById(courseId);

    if (!course) return res.status(404).json({ message: "Course not found" });

    const options = {
      amount: course.price * 100, // Razorpay works in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      course,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// 2. Verify Signature + Save Enrollment --------------
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Save Enrollment ----------------------------
    const userId = req.user._id;

    const enrollment = await enrollmentModel.create({
      userId,
      courseId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "success",
    });

    await userModel.findByIdAndUpdate(userId, {
      $addToSet: { enrolledCourses: courseId },
    });

    await courseModel.findByIdAndUpdate(courseId, {
      $addToSet: { enrollments: userId },
    });

    res.status(200).json({
      success: true,
      message: "Payment Verified & Enrollment Successful",
      enrollment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Payment verification failed" });
  }
};
