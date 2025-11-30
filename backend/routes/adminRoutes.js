const express = require('express')
const router = express.Router()

const { protect, autherizeRoles } = require('./../middleware/auth')
const { 
    getAllUsers, 
    addUser, 
    updateUserRole, 
    deleteUser, 
    updateOrderStatus,
    deleteProduct,
    updateProduct 
} = require('../controllers/adminController')
const { getSingleUser } = require('../controllers/userController')

// User routes
router
    .route("/users")
    .get(protect, autherizeRoles("admin"), getAllUsers)
    .post(protect, autherizeRoles('admin'), addUser)

router
    .route("/users/:id")
    .get(protect, autherizeRoles("admin"), getSingleUser)
    .put(protect, autherizeRoles("admin"), updateUserRole)
    .delete(protect, autherizeRoles("admin"), deleteUser)

// Order routes
router
    .route("/orders/:id")
    .put(protect, autherizeRoles("admin"), updateOrderStatus)

// Product routes
router
    .route("/products/:id")
    .put(protect, autherizeRoles("admin"), updateProduct)
    .delete(protect, autherizeRoles("admin"), deleteProduct)

module.exports = router;