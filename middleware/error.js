const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  if (err.code === 11000) {
    const message = `Duplicate: ${err.keyValue.email} already exists`;
    err = new ErrorHandler(message, 400);
  }
  if (err.kind === "ObjectId") {
    const message = `Product not found with id ${err.value}`;
    err = new ErrorHandler(message, 404);
  }
  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
