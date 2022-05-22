const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken");
const User = require("../api/user/user.model");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;
const sendEmail = require("../utils/sendEmail");
exports.createUser = async ({ body, file }, next) => {
  const { email, password, name } = body;
  if (!email || !password) {
    return next(new ErrorHandler("Se requiere Email y contraseña", 400));
  }
  const avatar = {
    public_id: "istockphoto-1130884625-612x612_cwvfdf",
    url: "https://res.cloudinary.com/dx1ece9ck/image/upload/v1651166764/store/users/istockphoto-1130884625-612x612_cwvfdf.jpg",
  };

  if (file) {
    const myCloud = await cloudinary.uploader.upload(file.path, {
      folder: "store/users",
      width: 150,
      crop: "scale",
    });
    avatar.public_id = myCloud.public_id;
    avatar.url = myCloud.url;
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar,
  });
  return user;
};

exports.findEmail = async ({ email }, next) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return next(new ErrorHandler("tu correo no existe", 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    /*  const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/reset/${resetToken}`; dev Backend*/
    const resetPasswordUrl = `${process.env.FRONTEND_ENDPOINT}/reset/password/${resetToken}`;
    const message = `su token de restablecimiento de contraseña es :- \n\n ${resetPasswordUrl} \n\n si no solicitó este restablecimiento, ignore este correo electrónico`;
    await sendEmail({
      email: user.email,
      subject: "Restablecer contraseña del Ecommerce",
      message,
    });
    return user;
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (
  { oldPassword, newPassword, confirmPassword },
  { id },
  next
) => {
  const user = await User.findById(id).select("+password");

  const isPasswordMatched = user.comparePassword(oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Antigua contraseña es incorrecta", 401));
  }
  if (newPassword !== confirmPassword) {
    return next(new ErrorHandler("Las contraseñas no coinciden", 400));
  }
  user.password = newPassword;
  await user.save();
  return user;
};
exports.resetIdPassword = async (
  { token },
  { password, confirmPassword },
  next
) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
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

  if (password !== confirmPassword)
    return next(new ErrorHandler("Las contraseñas no coinciden", 400));
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
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
        new ErrorHandler("No está autorizado para acceder a este recurso", 403)
      );
    }
    next();
  };
};
