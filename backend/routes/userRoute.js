const express = require("express")
const router = express.Router();
const { registerUser, loginUser, logout, forgetPassword, resentPassword, profile, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { protect, autherizeRoles } = require('../middleware/auth');

router
    .route("/register")
    .post(registerUser);

router
    .route("/login")
    .get(loginUser);

router
    .route("/profile")
    .get(protect, profile)

router
    .route("/password/forgot")
    .post(forgetPassword)

router
    .route("/password/reset/:token")
    .put(resentPassword)

router
    .route("/logout")
    .get(logout)

router
    .route("/password/update")
    .put(protect, updatePassword)

router
    .route("/me/update")
    .put(protect, updateProfile)

router
    .route("/admin/users")
    .get(protect, autherizeRoles("admin"), getAllUsers)

router
    .route("/admin/user/:id")
    .get(protect, autherizeRoles("admin"), getSingleUser)
    .put(protect, autherizeRoles("admin"), updateUserRole)
    .delete(protect, autherizeRoles("admin"), deleteUser)

module.exports = router;