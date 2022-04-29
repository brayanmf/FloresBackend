const Product = require("./product.model");
const ErrorHandler = require("../../utils/errorHandler");
const ApiFeatures = require("../../utils/apiFeatures");
const sendResponse = require("../../utils/sendResponse");
const { ReviewCreate } = require("./product.services");
const { findProduct } = require("./utils/findProduct");

exports.createProduct = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    sendResponse(product, "success", 201, res);
  } catch (err) {
    next(err);
  }
};
exports.getAllProducts = async (req, res, next) => {
  try {
    const resultPerPage = 3;
    //  const productCount = await Product.countDocuments();
    const ApiFeature = new ApiFeatures(Product, req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const products = await ApiFeature.products;
    sendResponse(products, "success", 200, res);
  } catch (err) {
    next(err);
  }
};
exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await findProduct(req.params.id);
    sendResponse(product, "success", 200, res);
  } catch (err) {
    next(err);
  }
};
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return next(
        new ErrorHandler(
          `Producto no encontrado con id de ${req.params.id}`,
          404
        )
      );
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    sendResponse(product, "success", 200, res);
  } catch (err) {
    next(err);
  }
};
exports.deleteProduct = async (req, res, next) => {
  const product = await findProduct(req.params.id);
  await product.remove();
  sendResponse(product, "Product deleted successfully", 200, res);
};

exports.createProductReview = async (req, res, next) => {
  try {
    const product = ReviewCreate(req, res, next);
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
    });
  } catch (err) {
    next(err);
  }
};
exports.getProductReviews = async (req, res, next) => {
  try {
    const product = await findProduct(req.params.id);
    sendResponse(product.reviews, "success", 200, res);
  } catch {
    next(err);
  }
};
exports.deleteReview = async (req, res, next) => {
  const product = await findProduct(req.params.id);
  const newReviews = product.reviews.filter(
    (rev) => rev.user.toString() !== req.user._id.toString()
  );
  const rating = averageReview(newReviews);
  const numOfReviews = newReviews.length;
  await Product.findByIdAndUpdate(
    req.params.id,
    { reviews: newReviews, rating, numOfReviews },
    { new: true, runValidators: true }
  );
  sendResponse(null, "success", 200, res);
};
