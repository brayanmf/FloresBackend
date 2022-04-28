const { Router } = require("express");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const router = Router();

router.get("/user/me", isAuthenticated, getDetails);
router.get("/user/getAll", isAuthenticated, authorizeRoles("admin"), getAll);

router.get("/user/me/update", isAuthenticated, updateProfile);
router
  .route("/user/admin/:id")
  .get(isAuthenticated, authorizeRoles("admin"), getSingleUser)
  .put(isAuthenticated, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticated, authorizeRoles("admin"), deleteUser);
module.exports = router;
