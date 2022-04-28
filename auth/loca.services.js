const sendEmail = require("../utils/sendEmail");
const ErrorHandler = require("../utils/errorHandler");

exports.responseEmail = async (user) => {
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
