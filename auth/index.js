const { Router } = require("express");
const multer = require("multer");

const { isAuthenticated } = require("./auth.services");
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require("./auth.controller");
const router = Router();

const upload = multer({ dest: "./temp" });

router.post("/register", upload.single("avatar"), register);
router.get("/logout", logout);
router.post("/login", login);
router.post("/forgot", forgotPassword);
router.put("/reset/:token", resetPassword);
router.put("/password/update", isAuthenticated, updatePassword);

module.exports = router;
