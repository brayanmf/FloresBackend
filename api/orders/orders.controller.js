const sendResponse = require("../../utils/sendResponse");
const {
  ordersAdd,
  ordersFind,
  ordersFindById,
  ordersFindByUser,
  ordersUpdate,
  ordersRemove,
} = require("./orders.services");

exports.newOrder = async (req, res, next) => {
  try {
    const order = await ordersAdd(req.body, req.user);

    sendResponse(order, "Order created successfully", 201, res);
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const { orders, totalAmount } = await ordersFind();
    res.status(200).json({
      success: true,
      totalAmount,
      orders,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await ordersFindById(req.params);

    sendResponse(order, "Order found successfully", 200, res);
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await ordersFindByUser(req.user, next);
    sendResponse(orders, "Orders found successfully", 200, res);
  } catch (err) {
    next(err);
  }
};

exports.updateOrder = async (req, res, next) => {
  try {
    await ordersUpdate(req.params, req.body, next);
    sendResponse(res, 200, "Order updated successfully");
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    await ordersRemove(req.params, next);
    sendResponse(res, 200, "Order deleted successfully");
  } catch (err) {
    next(err);
  }
};
