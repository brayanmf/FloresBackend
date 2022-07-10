const Product = require("../product.model");
const ErrorHandler = require("../../../utils/errorHandler");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

exports.findProduct = async (id) => {
  try {
    const product = Product.findById(id);
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
exports.averageData = (product) => {
  let avg = 0;
  product.reviews.forEach((e) => {
    avg += e.rating;
  });
  return avg / product.reviews.length;
};

exports.pushImages = async (files) => {
  const arrayImages = [];

  for (const el of files) {
    try {
      const myCloud = await cloudinary.uploader.upload(el.path, {
        folder: "store/clothing",
      });

      arrayImages.push({ public_id: myCloud.public_id, url: myCloud.url });
    } catch (err) {
      console.log(err);
    } finally {
      fs.unlinkSync(el.path);
    }
  }
  return arrayImages;
};
