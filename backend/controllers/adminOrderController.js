const Order = require("./../models/orderModel")
const catchAsync = require('../middleware/catchAsyncError');

// @route GET /api/admin/orders
// @desc Get all order (Admin only)
// @access Private/Admin
exports.adminGetAllOrder = catchAsync(async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
});

// @route PUT /api/admin/orders/:id
// @desc Update Order (Admin only)
// @access Private/Admin
exports.adminUpdateOrder = catchAsync(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)

        if (order) {
            order.status = req.body.status || order.status;

            if (req.body.status === "Delivered") {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }

            const updatedOrder = await order.save();
            res.json(updatedOrder)
        } else {
            res.status(404).json({ message: "Order not found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})

// @route DELETE /api/admin/orders/:id
// @desc Delete Order (Admin only)
// @access Private/Admin
exports.adminDeleteOrder = catchAsync(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
        if (order) {
            await order.deleteOne();
            res.json({ message: "Order removed" })
        } else {
            res.status(404).json({ message: "Order not found" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})