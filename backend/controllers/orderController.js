const Order = require('../models/orderModel')
const catchAsync = require('../middleware/catchAsyncError');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');

// Create new Order
exports.newOrder = catchAsync(async (req, res, next) => {
    const { shippingInfo, orderItems, paymentInfo, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;


    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    })

    res.status(200).json({
        success: true,
        order
    })
})

// @route GET /api/order/:id
// @desc Get order details by ID 
// @access Private
exports.getSingeOrder = catchAsync(async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            "user",
            "name email",
        );

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        //Return the full order details
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})

// @route GET /api/orders/my-orders
// @desc Get logged-in user's orders
// @access Private
exports.myOrders = catchAsync(async (req, res,) => {
    try {
        // Find order for authenticated user
        const order = await Order.find({ user: req.user._id }).sort({
            createdAt: -1,
        }); // sort most recent orders
        res.json(order)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
});

// Get all orders -- (Admin)
exports.getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find()

    let totalAmount = 0;
    orders.forEach((order) => {
        totalAmount += order.totalPrice
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    })
})

// Update Order Status -- (Admin)
exports.updateOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    if (order.orderStatus === "Delivered") {
        return next(new ErrorHandler("You have already delivered this order", 400));
    }

    order.orderItems.forEach(async (item) => {
        await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.status;

    if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
    }

    await order.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        order,
    });
});

async function updateStock(id, quantity) {
    const product = await Product.findById(id);

    if (!product) {
        throw new ErrorHandler("Product not found", 404);
    }

    product.Stock -= quantity;

    await product.save({ validateBeforeSave: false });
}

// Delete orders -- (Admin)
exports.deleteOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404));
    }

    await order.deleteOne();

    res.status(200).json({
        success: true,
        message: "Order deleted successfully"
    });
});