const findProduct = require("./utils/findProduct");

const averageData = (product) => {
  let avg = 0;
  product.reviews.forEach((e) => {
    avg += e.rating;
  });
  return avg / product.reviews.length;
};
exports.averageReview = (newReviews) => {
  let auxi = 0;
  newReviews.forEach((e) => {
    auxi += e.rating;
  });
  let rating = 0;
  if (newReviews.length > 0) {
    rating = auxi / newReviews.length;
  }
  return rating;
};
exports.ReviewCreate = async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };
  const product = await findProduct(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );
  if (isReviewed) {
    product.reviews.forEach((el) => {
      if (el.user.toString() === req.user._id.toString())
        (el.rating = rating), (el.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.rating = averageData(product);
  return product;
};
