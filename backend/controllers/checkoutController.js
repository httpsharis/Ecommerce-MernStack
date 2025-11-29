const express = require("express")
const Checkout = require("./../models/checkout")
const Cart = require("./../models/cartModel")
const Product = require("./../models/productModel")
const Order = require("./../models/orderModel")
const catchAsync = require("../middleware/catchAsyncError")

// @route POST /api/checkout
// Create a new checkout session
// @access Privte
exports.createCheckout = catchAsync(async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ 
            success: false,
            message: "No items in checkout" 
        })
    }

    try {
        // Create a new checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false
        });
        console.log(`Checkout created for user: ${req.user._id}`);
        
        // ✅ FIX: Return consistent response format
        return res.status(201).json({
            success: true,
            checkout: newCheckout,
            message: 'Checkout created successfully'
        })
    } catch (error) {
        console.error("Error Creating checkout session:", error);
        return res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: error.message 
        })
    }
});

// @route PUT /api/checkout/:id/pay
// Update checkout to mark as paid after successful payment
// @access Private
exports.updateCheckout = catchAsync(async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body

    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ 
                success: false,
                message: "Checkout not found" 
            })
        }

        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            // ✅ FIX: Return consistent response format
            return res.status(200).json({
                success: true,
                checkout,
                message: 'Payment updated successfully'
            });
        } else {
            return res.status(400).json({ 
                success: false,
                message: "Invalid Payment Status" 
            })
        }
    } catch (error) {
        console.error('Update checkout error:', error);
        return res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: error.message 
        })
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
                orderItems: checkout.checkoutItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails,
            })

            // Make the checkout finalized 
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();
            
            // Delete the cart associated with the user
            await Cart.findOneAndDelete({ user: checkout.user })
            
            console.log('Order finalized:', finalOrder); // ✅ Debug
            
            // ✅ FIX: Return order wrapped in object with success flag
            return res.status(201).json({
                success: true,
                order: finalOrder,
                message: 'Order created successfully'
            });
        } else if (checkout.isFinalized) {
            return res.status(400).json({ 
                success: false,
                message: "Checkout already finalized" 
            })
        } else {
            return res.status(400).json({ 
                success: false,
                message: "Checkout is not Paid" 
            })
        }
    } catch (error) {
        console.error('Finalize checkout error:', error);
        return res.status(500).json({ 
            success: false,
            message: "Server Error",
            error: error.message 
        })
    }
})