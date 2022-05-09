const express = require("express");
const router = express.Router();
const {
  newOrder,
  getSingleOrder,
  getMyOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
} = require("./orders.controller");
const {
  isAuthenticateUser,
  authorizeRoles,
} = require("../../auth/auth.services");

router.route("/order/new").post(isAuthenticateUser, newOrder);
router.route("/order/:id").get(isAuthenticateUser, getSingleOrder);
router.route("/orders/my").get(isAuthenticateUser, getMyOrders);
router
  .route("/admin/orders")
  .get(isAuthenticateUser, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticateUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticateUser, authorizeRoles("admin"), deleteOrder);

module.exports = router;
