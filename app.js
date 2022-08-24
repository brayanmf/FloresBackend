const express = require("express");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");
const auth = require("./auth");
const user = require("./api/user");
const product = require("./api/product");
const payment = require("./api/payment");
const order = require("./api/orders");

const errorMiddleware = require("./middleware/error");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  origin: process.env.FRONTEND_ENDPOINT,
};

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

app.use(cors(corsOptions));
app.use("/api/v1", user);
app.use("/api/v1", auth);
app.use("/api/v1", product);
app.use("/api/v1", payment);
app.use("/api/v1", order);
app.use(errorMiddleware);
module.exports = app;
