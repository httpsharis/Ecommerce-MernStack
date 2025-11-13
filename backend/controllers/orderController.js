const Order = require('../models/orderModel')
const catchAsync = require('../middleware/catchAsyncError');
const Product = require('../models/productModel');
const ApiFeatures = require('../utils/apiFeatures');
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

// Get Single Order Details
exports.getSingeOrder = catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new ErrorHandler("Order not found with this ID", 404))
    }

    res.status(200).json({
        success: true,
        order,
    })
})

// Get logged in user Order
exports.myOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
        return next(new ErrorHandler("No orders found for this user", 404));
    }

    res.status(200).json({
        success: true,
        orders,
    });
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