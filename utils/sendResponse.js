const sendResponse = (data, message, statusCode, res) => {
  if (data === null) data = {};
  if (message === null) message = "";
  res.status(statusCode).json({
    sucess: true,
    message,
    data,
  });
};

module.exports = sendResponse;
