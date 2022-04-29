const User = require("../user.model");
const ErrorHandler = require("../../../utils/errorHandler");

exports.findUser = async (idUser) => {
  const user = User.findById(idUser);
  if (!user) {
    return next(new ErrorHandler("Usuario no encontrado", 404));
  }
  return user;
};
