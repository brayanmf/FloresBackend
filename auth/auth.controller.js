const User = require("../api/user/user.model");
const sendToken = require("../utils/sendToken");
const sendEmail = require("../utils/sendEmail");
const ErrorHandler = require("../utils/errorHandler");
const crypto = require("crypto");
const sendResponse = require("../utils/sendResponse");
const { createUser, findEmail } = require("./auth.services");
const fs = require("fs");

exports.register = async (req, res, next) => {
  try {
    const user = await createUser(req, next);
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  } finally {
    fs.unlink(req.file.path, (err) => {
      if (err) throw err;
    });
  }
};
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ErrorHandler("Se requiere Email y contraseña", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Email inválido", 401));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("contraseña inválida", 401));
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
  const { user, message } = await findEmail(req.body, next);
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
          "El token de restablecimiento de contraseña no es válido o ha caducado",
          400
        )
      );

    if (req.body.password !== req.body.confirmPassword)
      return next(new ErrorHandler("Las contraseñas no coinciden", 400));
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
      return next(new ErrorHandler("Antigua contraseña es incorrecta", 401));
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Las contraseñas no coinciden", 400));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
