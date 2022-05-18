const mercadopago = require("mercadopago");
mercadopago.configurations.setAccessToken(process.env.REACT_APP_TOKEN_ACCESS);

exports.postPayment = async (data) => {
  const { ...paymentData } = data;
  const response = await mercadopago.payment.save(paymentData);

  return response;
};
