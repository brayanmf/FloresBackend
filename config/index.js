const mongoose = require("mongoose");
const connectionString = process.env.DB_CONNECTION_URI;
const connectDatabase = () => {
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
