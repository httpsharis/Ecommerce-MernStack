const express = require('express')
const router = express.Router()

const { protect, autherizeRoles } = require('./../middleware/auth')
const { getAllUsers, addUser, updateUserRole, deleteUser } = require('../controllers/adminController')

router
    .route("/users")
    .get(protect, autherizeRoles("admin"), getAllUsers)
    .post(protect, autherizeRoles('admin'), addUser)

router
    .route("/user/:id")
    //     .get(protect, autherizeRoles("admin"), getSingleUser)
    .put(protect, autherizeRoles("admin"), updateUserRole)
    .delete(protect, autherizeRoles("admin"), deleteUser)

module.exports = router;