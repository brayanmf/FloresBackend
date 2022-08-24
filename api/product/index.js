const { Router } = require("express");
const { isAuthenticated, authorizeRoles } = require("../../auth/auth.services");
const multer = require("multer");
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
  getAdminProducts,
} = require("./product.controller");
const upload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
  dest: "./temp",
});
/* const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "temp/");
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
  limits: { fieldSize: 25 * 1024 * 1024 },
});
const upload = multer({ storage, limits: { fieldSize: 25 * 1024 * 1024 } });*/
router.get("/product/all", getAllProducts);
router.get(
  "/admin/products",
  isAuthenticated,
  authorizeRoles("admin"),
  getAdminProducts
);
router.get("/product/:id", getProductDetails);
router.post(
  "/admin/product/new",
  isAuthenticated,
  authorizeRoles("admin"),
  upload.array("images"),
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
