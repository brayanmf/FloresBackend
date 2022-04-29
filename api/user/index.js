const { Router } = require("express");
const { isAuthenticated, authorizeRoles } = require("../../auth/auth.services");
const router = Router();
const {
  getDetails,
  getAll,
  updateProfile,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("./user.controller");

router.get("/user/me", isAuthenticated, getDetails);
router.get("/user/getAll", isAuthenticated, authorizeRoles("admin"), getAll);

router.get("/user/me/update", isAuthenticated, updateProfile);
router
  .route("/admin/user/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);
module.exports = router;
