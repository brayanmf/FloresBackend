const app = require("./app");
const connectDatabase = require("./config");
app.listen(process.env.PORT || 8000, () => {
  connectDatabase();
});
