const app = require("./app");
require("dotenv").config({
  path: ".env",
});
const connectDatabase = require("./config");
app.listen(process.env.PORT || 8000, () => {
  connectDatabase();
});
