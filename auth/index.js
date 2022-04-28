const { Router } = require("express");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("./local.controller");
const router = Router();

router.post("/register", register);
router.get("/logout", logout);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.put("/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);
