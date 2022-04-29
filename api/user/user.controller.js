const User = require("./user.model");
const ErrorHandler = require("../../utils/errorHandler");
const sendResponse = require("../../utils/sendResponse");
const findUser = require("./utils/findUser");

exports.getDetails = async (req, res, next) => {
  try {
    const user = await findUser(req.user.id);
    sendResponse(user, "success", 200, res);
  } catch (err) {
    next(err);
  }
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
    const user = await findUser(req.params.id);
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
        new ErrorHandler(`El usuario no existe con el id ${req.params.id}`, 404)
      );
    }
    sendResponse(user, "User deleted successfully", 200, res);
  } catch (err) {
    next(err);
  }
};
