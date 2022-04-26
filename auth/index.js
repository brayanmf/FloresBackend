const { Router } = require("express");
const { isAuthenticated } = require("../middleware/auth");
const {
  register,
  login,
  logout,
  getAll,
  forgotPassword,
  resetPassword,
  getDetails,
  updatePassword,
} = require("./auth.controller");
const router = Router();

router.post("/user/register", register);
router.get("/user/logout", logout);
router.post("/user/login", login);
router.post("/user/forgot", forgotPassword);
router.put("/user/reset/:token", resetPassword);
router.route("/password/update").put(isAuthenticated, updatePassword);
router.route("/me").get(isAuthenticated, getDetails);
router.get("/user/getAll", isAuthenticated, getAll);
module.exports = router;
