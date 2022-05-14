const ErrorHandler = require("../utils/errorhandler");
const jwt = require("jsonwebtoken");
const User = require("../api/user/user.model");

const cloudinary = require("cloudinary").v2;

exports.createUser = async ({ body, file }, next) => {
  const { email, password, name } = body;
  if (!email || !password) {
    return next(new ErrorHandler("Se requiere Email y contraseña", 400));
  }

  const myCloud = await cloudinary.uploader.upload(file.path, {
    folder: "store/users",
    width: 150,
    crop: "scale",
  });

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.url,
    },
  });
  return user;
};

exports.findEmail = async ({ email }, next) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new ErrorHandler("tu correo no existe", 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/reset/${resetToken}`;
  const message = `su token de restablecimiento de contraseña es :- \n\n ${resetPasswordUrl} \n\n si no solicitó este restablecimiento, ignore este correo electrónico`;

  return { user, message };
};

/***************** */

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
