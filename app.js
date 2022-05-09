const express = require("express");
const cookieParser = require("cookie-parser");
const auth = require("./auth");
const user = require("./api/user");
const product = require("./api/product");

const errorMiddleware = require("./middleware/error");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  origin: ["http://localhost:3000"],
};
app.use(cors(corsOptions));
app.use("/api/v1", user);
app.use("/api/v1", auth);
app.use("/api/v1", product);
app.use(errorMiddleware);
module.exports = app;
