const sendEmail = require("../utils/sendEmail");
const ErrorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../api/user/user.model");
const sendResponse = require("../utils/sendResponse");

exports.responseEmail = async (req, res, user) => {
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/reset/${resetToken}`;
  const message = `su token de restablecimiento de contraseña es :- \n\n ${resetPasswordUrl} \n\n si no solicitó este restablecimiento, ignore este correo electrónico`;

  await sendEmail({
    email: user.email,
    subject: "Restablecer contraseña del Ecommerce",
    message,
  });

  return sendResponse(
    null,
    `Correo electrónico enviado a ${user.email} con éxito`,
    200,
    res
  );
};

exports.isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(
      new ErrorHandler("Inicie sesión para acceder a este recurso", 401)
    );
  }
  const decodeData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodeData.id);
  if (!req.user) {
    return next(
      new ErrorHandler("Inicie sesión para acceder a este recurso", 401)
    );
  }
  next();
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorHandler("YNo está autorizado para acceder a este recurso", 403)
      );
    }
    next();
  };
};
