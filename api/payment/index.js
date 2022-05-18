const express = require("express");
const { isAuthenticated } = require("../../auth/auth.services");

const router = express.Router();
const { paymentCard } = require("./payment.controller.js");

router.route("/payment/pay").post(isAuthenticated, paymentCard);

module.exports = router;
