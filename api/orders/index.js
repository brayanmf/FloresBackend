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
const { isAuthenticated, authorizeRoles } = require("../../auth/auth.services");

router.route("/order/new").post(isAuthenticated, newOrder);
router.route("/order/:id").get(isAuthenticated, getSingleOrder);
router.route("/orders/me").get(isAuthenticated, getMyOrders);
router
  .route("/admin/orders")
  .get(isAuthenticated, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticated, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteOrder);

module.exports = router;
