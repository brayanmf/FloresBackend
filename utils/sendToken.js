const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken();
  const expDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
  );

  const httpOnlyCookieOptions = {
    expires: expDate,
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, httpOnlyCookieOptions).json({
    sucess: true,
    user,
  });
};

module.exports = sendToken;
