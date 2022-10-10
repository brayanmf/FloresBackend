const User = require("../api/user/user.model");
const sendToken = require("../utils/sendToken");

const ErrorHandler = require("../utils/errorHandler");

const sendResponse = require("../utils/sendResponse");
const {
  createUser,
  findEmail,
  changePassword,
  resetIdPassword,
} = require("./auth.services");
const fs = require("fs");

exports.register = async (req, res, next) => {
  try {
    const user = await createUser(req, next);
    sendToken(user, 201, res);
  } catch (err) {
    next(err);
  } finally {
    if (req.file)
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
  const user = await findEmail(req.body, next);

  try {
    if (user)
      sendResponse(
        null,
        `Correo electrónico enviado a ${user.email} con éxito`,
        200,
        res
      );
  } catch (err) {
    if (!user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user?.save({ validateBeforeSave: false });
    }

    return next(err);
  }
};
exports.resetPassword = async (req, res, next) => {
  try {
    await resetIdPassword(req.params, req.body, next);
    sendResponse(null, "actualización de contraseña con éxito", 200, res);
  } catch (err) {
    next(err);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const user = await changePassword(req.body, req.user, next);
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};
