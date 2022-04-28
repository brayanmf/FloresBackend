const User = require("../api/user/user.model");
const sendToken = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const responseEmail = require("./local.services");

exports.register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required", 400));
    }
    const user = await User.create({
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Email and password are required", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invalid email", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Invalid password", 401));
    }
    sendToken(user, 200, res);
  } catch (err) {
    return next(err);
  }
};
exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  sendResponse(null, "Logout SuccessFully", 200, res);
};
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  try {
    if (!user) {
      return next(new ErrorHandler("your email does not exist", 404));
    }
    await responseEmail(user);
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return next(
        new ErrorHandler(
          "Reset Password Token is invalid or has been expired",
          400
        )
      );

    if (req.body.password !== req.body.confirmPassword)
      return next(new ErrorHandler("Passwords do not match", 400));
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    const isPasswordMatched = user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("old password is incorrect", 401));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("password does not match", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
