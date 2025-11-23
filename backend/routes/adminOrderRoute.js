const express = require('express');
const router = express.Router();
const { protect, autherizeRoles } = require('../middleware/auth');

const { adminGetAllOrder, adminUpdateOrder, adminDeleteOrder } = require('../controllers/adminOrderController');

router
    .route('/orders')
    .get(protect, autherizeRoles('admin'), adminGetAllOrder)

router
    .route('/orders/:id')
    .put(protect, autherizeRoles('admin'), adminUpdateOrder)

router
    .route('/orders/:id')
    .delete(protect, autherizeRoles('admin'), adminDeleteOrder)

module.exports = router;