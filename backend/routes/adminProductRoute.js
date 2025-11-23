const express = require('express');
const router = express.Router();

const { protect, autherizeRoles } = require('../middleware/auth');
const { adminGetAllProducts } = require('../controllers/adminProductController');

router
    .route("/")
    .get(protect, autherizeRoles('admin'), adminGetAllProducts)

module.exports = router