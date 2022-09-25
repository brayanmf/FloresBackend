const Product = require("../product.model");
const ErrorHandler = require("../../../utils/errorHandler");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

exports.findProduct = async (id) => {
  const product = Product.findById(id);
  if (!product) {
    return next(
      new ErrorHandler(`Producto no encontrado con id de ${req.params.id}`, 404)
    );
  }
  for (let i = 0; i < product.images?.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }

  return product;
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
