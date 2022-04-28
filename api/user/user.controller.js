const User = require("./user/user.model");
const ErrorHandler = require("../utils/errorHandler");
const sendResponse = require("../utils/sendResponse");

exports.getDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  sendResponse(user, "success", 200, res);
};

exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find();
    sendResponse(users, "Users List", 200, res);
  } catch (err) {
    next(err);
  }
};
exports.updateProfile = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
      new: true,
      runValidators: true,
    });
    sendResponse(user, "success", 200, res);
  } catch (err) {
    next(err);
  }
};
exports.getSingleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return next(
        new ErrorHandler(
          `the user does not exist with the id ${req.params.id}`,
          404
        )
      );
    sendResponse(user, "success", 200, res);
  } catch (err) {
    next(err);
  }
};
exports.updateUserRole = async (req, res, next) => {
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role: req.body.role,
    };
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
      new: true,
      runValidators: true,
    });
    sendResponse(user, "success", 200, res);
  } catch (err) {
    next(err);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return next(
        new ErrorHandler(
          `the user does not exist with the id ${req.params.id}`,
          404
        )
      );
    }
    sendResponse(user, "User deleted successfully", 200, res);
  } catch (err) {
    next(err);
  }
};
