const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controllers/enrollment.controller.js");
const { verifyJwt } = require("../middleware/verifyJwt.js");

router.route("/create-order").post(verifyJwt, createOrder);
router.route("/verify-payment").post(verifyJwt, verifyPayment);


module.exports = router;