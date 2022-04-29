const Product = require("../product.model");
const ErrorHandler = require("../../../utils/errorHandler");

exports.findProduct = async (req, res, next) => {
  try {
    Product.findById(req.params.id);
    if (!product) {
      return next(
        new ErrorHandler(
          `Producto no encontrado con id de ${req.params.id}`,
          404
        )
      );
    }
    return product;
  } catch (err) {
    next(err);
  }
};
