const mongoose = require("mongoose");

const {
  NODE_ENV,
  DB_CONNECTION_URI,
  DB_CONNECTION_URI_TEST,
  DB_CONNECTION_URI_PROD,
} = process.env;

let connectionString =
  NODE_ENV === "test" ? DB_CONNECTION_URI_TEST : DB_CONNECTION_URI;
if (NODE_ENV === "production") connectionString = DB_CONNECTION_URI_PROD;

const connectDatabase = () => {
 console.log(connectionString,"bmf")
  mongoose
    .connect(connectionString)
    .then(() =>
      console.log("Successfully connected to DB <{", connectionString, "}>")
    )
    .catch((err) =>
      console.log(
        "Couldn't connect to DB <{",
        connectionString,
        "}>. Error: ",
        err
      )
    );
};
module.exports = connectDatabase;
