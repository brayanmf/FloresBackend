const { Router } = require("express");
const { isAuthenticated, authorizeRoles } = require("../../auth/auth.services");
const router = Router();
const {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createProductReview,
  deleteReview,
} = require("./product.controller");

router.get("/product/all", getAllProducts);
router.get("/product/:id", getProductDetails);
router.post(
  "/admin/product/new",
  isAuthenticated,
  authorizeRoles("admin"),
  createProduct
);
router
  .route("/admin/product/:id")
  .get(isAuthenticated, deleteProduct)
  .put(isAuthenticated, updateProduct);

router.put("/product/review", isAuthenticated, createProductReview);
router
  .route("/product/review/:id")
  .get(isAuthenticated, getProductReviews)
  .delete(isAuthenticated, deleteReview);

module.exports = router;
