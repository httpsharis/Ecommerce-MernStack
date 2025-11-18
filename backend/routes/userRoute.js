const express = require("express")
const router = express.Router();
const { protect } = require("./../middleware/auth")
const { registerUser, loginUser, logout, forgetPassword, resentPassword, getUserDetails, updatePassword, updateProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatedUser, autherizeRoles } = require('../middleware/auth');

router
    .route("/register")
    .post(registerUser);

router
    .route("/login")
    .post(loginUser);

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
    .route("/me")
    .get(isAuthenticatedUser, getUserDetails)

router
    .route("/password/update")
    .put(isAuthenticatedUser, updatePassword)

router
    .route("/me/update")
    .put(isAuthenticatedUser, updateProfile)

router
    .route("/admin/users")
    .get(isAuthenticatedUser, autherizeRoles("admin"), getAllUsers)

router
    .route("/admin/user/:id")
    .get(isAuthenticatedUser, autherizeRoles("admin"), getSingleUser)
    .put(isAuthenticatedUser, autherizeRoles("admin"), updateUserRole)
    .delete(isAuthenticatedUser, autherizeRoles("admin"), deleteUser)

module.exports = router;