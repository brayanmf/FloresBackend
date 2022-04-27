const User = require("./auth.model");
const sendToken = require("../utils/sendToken");
const ErrorHandler = require("../utils/errorHandler");
const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const sendEmail = require("../utils/sendEmail");
exports.register = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required", 400));
  }
  try {
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
};
exports.logout = async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  sendResponse(null, "Logout SuccessFully", 200, res);
};
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find();
    sendResponse(users, "Users List", 200, res);
  } catch (err) {
    next(err);
  }
};
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler("your email does not exist", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/reset/${resetToken}`;
  const message = `su token de restablecimiento de contraseña es :- \n\n ${resetPasswordUrl} \n\n si no solicitó este restablecimiento, ignore este correo electrónico`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Restablecer contraseña del Ecommerce",
      message,
    });
    sendResponse(
      null,
      `Correo electrónico enviado a ${user.email} con éxito`,
      200,
      res
    );
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
exports.getDetails = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  sendResponse(user, "success", 200, res);
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
