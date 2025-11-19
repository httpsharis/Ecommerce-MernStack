const express = require("express")
const router = express.Router();
const { protect, autherizeRoles } = require('../middleware/auth');
const { newOrder, getSingeOrder, myOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController");


router.route('/order/new').post(protect, newOrder)

router.route('/order/:id').get(protect, autherizeRoles('admin'), getSingeOrder)

router.route('/orders/me').get(protect, myOrders);

router.route('/admin/orders').get(protect, autherizeRoles('admin'), getAllOrders);

router
    .route('/admin/order/:id')
    .put(protect, autherizeRoles('admin'), updateOrder)
    .delete(protect, autherizeRoles('admin'), deleteOrder)

module.exports = router;