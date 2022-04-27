const { Router } = require("express");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const {
  register,
  login,
  logout,
  getAll,
  forgotPassword,
  resetPassword,
  getDetails,
  updatePassword,
  updateProfile,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("./auth.controller");
const router = Router();

router.post("/user/register", register);
router.get("/user/logout", logout);
router.post("/user/login", login);
router.post("/user/forgot", forgotPassword);
router.put("/user/reset/:token", resetPassword);
router.put("/user/password/update", isAuthenticated, updatePassword);
router.get("/user/me", isAuthenticated, getDetails);
router.get("/user/getAll", isAuthenticated, authorizeRoles("admin"), getAll);

router.get("/user/me/update", isAuthenticated, updateProfile);
router
  .route("/user/admin/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);
module.exports = router;
