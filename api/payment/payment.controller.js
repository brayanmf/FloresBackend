const sendResponse = require("../../utils/sendResponse");
const { postPayment } = require("./payment.services");

exports.paymentCard = async (req, res, next) => {
  try {
    const response = await postPayment(req.body);
    const { status, status_detail, id } = response.body;

    sendResponse({ status, status_detail, id }, null, response.status, res);
  } catch (err) {
    next(err);
  }
};
