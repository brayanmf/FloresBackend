const Product = require("./product.model");
const ErrorHandler = require("../../utils/errorHandler");
const ApiFeatures = require("../../utils/apiFeatures");
const sendResponse = require("../../utils/sendResponse");
const { ReviewCreate, createData } = require("./product.services");
const { findProduct } = require("./utils/index");
exports.createProduct = async (req, res, next) => {
  try {
   
    const product = await createData(req);
    sendResponse(product, "success", 201, res);
  } catch (err) {
    next(err);
  }
};
exports.getAllProducts = async (req, res, next) => {
  try {
    const resultPerPage = 20;
    const productsCount = await Product.countDocuments();
    const ApiFeature = new ApiFeatures(Product.find(), req.query)
      .search()
      .filter();
    let products = await ApiFeature.query;
    let filteredProductsCount = products.length;
    ApiFeature.pagination(resultPerPage);
    products = await ApiFeature.query.clone();

    res.status(200).json({
      sucess: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  } catch (err) {
    next(err);
  }
};
exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
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
    const product = await ReviewCreate(req.body, req.user);
    await product.save({ validateBeforeSave: false });
    sendResponse(null, "success", 200, res);
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
