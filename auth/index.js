const { Router } = require("express");
const { isAuthenticated, authorizeRoles } = require("./auth.services");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("./auth.controller");
const router = Router();

router.post("/register", register);
router.get("/logout", logout);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.put("/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

module.exports = router;
