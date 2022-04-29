class ApiFeatures {
  constructor(products, queryString) {
    this.products = products;
    this.queryString = queryString;
  }
  search() {
    const keywork = this.queryString.keyword
      ? { name: { $regex: this.queryString.keyword, $options: "i" } }
      : {};

    this.products = this.products.find({ ...keywork });
    return this;
  }
  filter() {
    const queryCopy = { ...this.queryString };

    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((el) => delete queryCopy[el]);
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.products = this.products.find(JSON.parse(queryStr));
    return this;
  }
  pagination(resultPerPage) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.products = this.products.skip(skip).limit(resultPerPage);
    return this;
  }
}
module.exports = ApiFeatures;
