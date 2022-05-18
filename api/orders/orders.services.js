const Orders = require("./orders.model");
const ErrorHandler = require("../../utils/errorHandler");
const Product = require("../product/product.model");

exports.ordersAdd = async (data, _id) => {
  return await Orders.create({ ...data, paidAt: Date.now(), user: _id });
};
exports.ordersFind = async () => {
  const orders = await Orders.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  const data = {
    orders,
    totalAmount,
  };
  return data;
};
exports.ordersFindById = async ({ id }, next) => {
  const order = await Orders.findById(id).populate("user", "name email");
  if (!order) {
    return next(new ErrorHandler("No se encontro el pedido", 404));
  }
  return order;
};
exports.ordersFindByUser = async ({ _id }, next) => {
  const orders = await Orders.find({ user: _id });
  if (!orders) {
    return next(new ErrorHandler("Usted no tiene ordenes", 404));
  }

  return orders;
};
async function update(id, quantity) {
  const product = await Product.findById(id);
  product.Stock -= quantity;
  await product.save({ validateBeforeSave: false });
}
exports.ordersUpdate = async ({ id }, { status }, next) => {
  const order = await Orders.findById(id);
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("ya has entregado este pedido", 404));
  }

  order.orderItems.forEach(async (e) => {
    await update(e.product, e.quantity);
  });

  order.orderStatus = status;
  if (status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  return await order.save({ validateBeforeSave: false });
};

exports.ordersRemove = async ({ id }, next) => {
  const order = await Orders.findById(id);
  if (!order) {
    return next(new ErrorHandler("No se encontro el pedido", 404));
  }
  await order.remove();
};
