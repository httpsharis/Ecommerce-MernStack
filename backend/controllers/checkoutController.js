const express = require("express")
const Checkout = require("./../models/checkout")
const Cart = require("./../models/cartModel")
const Product = require("./../models/productModel")
const Order = require("./../models/orderModel")
const catchAsync = require("../middleware/catchAsyncError")

// @route POST /api/checkout
// Create a new checkout session
// @access Privte
exports.createCheckout = catchAsync(async (res, req) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body

    if (!checkoutItems || checkItems.length === 0) {
        return res.status(400).json({ message: "No items in checkout" })
    }

    try {
        // Create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false
        });
        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(201).json(newCheckout)
    } catch (error) {
        console.error("Error Creating checkout session:", error);
        res.status(500).json({ message: "Server Error" })
    }
});

// @route PUT /api/checkout/:id/pay
// Update checkout to mark as paid after successful payment
// @access Private
exports.updateCheckout = catchAsync(async (res, req) => {
    const { paymentStatus, paymentDetails } = req.body

    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({
                message: "Checkout not found"
            })

            if (paymentStatus === "paid") {
                checkout.isPaid = true;
                checkout.paymentStatus = paymentStatus;
                checkout.paymentDetails = paymentDetails;
                checkout.isPaidAt = Date.now();
                await checkout.save();

                res.status(200).json(checkout);
            } else {
                res.status(400).json({ message: "Invalid Payment Status" })
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})

// @route POST /api/checkout/:id/finalize
// Finalize checkout and convert to an order after payment confirmation
// @access Private
exports.finalizeCheckout = catchAsync(async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ message: "Checkout not found" })
        }

        if (checkout.isPaid && !checkout.isFinalized) {
            // Create final order based on the check details
            const finalOrder = await Order.create({
                user: checkout.user,
                orderItems: check.orderItems,
                shippingAddress: check.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: check.paymentDetails,
            })

            // Make the checkout finalized 
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await check.save();
            // Delete the cart associated with teh user
            await Cart.findOneAndDelete({ user: checkout.user })
            res.status(201).json(finalOrder);
        } else if (checkout.isFinalized) {
            res.status(400).json({ message: "Checkout already finalized" })
        } else {
            res.status(400).json({ message: "Checkout is not Paid" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})