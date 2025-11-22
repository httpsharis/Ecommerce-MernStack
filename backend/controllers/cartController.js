const Cart = require("./../models/cartModel")
const catchAsync = require('../middleware/catchAsyncError');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');

// Helper function to get a cart by UserId or guest Id
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId })
    }
    return null
};

// @route POST /api/cart
// @Desc Add product to the cart for guest and Logged in user
// @access Public
exports.addProductInCart = catchAsync(async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found!" });

        // Determine if user is logged in or guest
        let cart = await getCart(userId, guestId);

        // If the cart exists, update it
        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) =>
                    p.productId.toString() === productId &&
                    p.size === size &&
                    p.color === color
            );

            if (productIndex > -1) {
                // If the product already exists, update the quantity.
                cart.products[productIndex].quantity += quantity;
            } else {
                // Add a new product
                cart.products.push({
                    productId,
                    name: product.name,
                    image: product.images[0].url,
                    price: product.price,
                    size,
                    color,
                    quantity,
                });
            }

            // Recalculate the total price
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            // Create a new cart for guest and user
            const newCart = await Cart.create({
                user: userId ? userId : undefined,
                guestId: guestId ? guestId : "guest_" + new Date().getTime(),
                products: [
                    {
                        productId,
                        name: product.name,
                        image: product.images[0].url,
                        price: product.price,
                        size,
                        color,
                        quantity,
                    },
                ],
                totalPrice: product.price * quantity,
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

// @route PUT /api/cart
// @desc Update the Qunatiy in the cart for guest and user.
// @access Public
exports.updateQuantity = catchAsync(async (req, res) => {
    const {
        productId, quantity, size, color, guestId, userId
    } = req.body

    try {
        let cart = await getCart(userId, guestId)
        if (!cart) return res.status(404).json({ message: "Cart not found" })

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            // update Quantity
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1) // remove the product if quantity is 0
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart)
        } else {
            return res.status(404).json({ message: "Product not found in cart" })
        };
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Server Error" })
    }
})

// @route DELETE /api/cart
// @Desc Removes the product from the cart
// @Access Public

exports.deleteCartProduct = catchAsync(async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;

    try {
        let cart = await getCart(userId, guestId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.products.findIndex(
            (p) =>
                p.productId.toString() === productId &&
                p.size === size &&
                p.color === color
        );

        if (productIndex > -1) {
            // Remove the product
            cart.products.splice(productIndex, 1);

            // Recalculate total price (Safe calculation)
            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + (Number(item.price) * Number(item.quantity)),
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ message: "Product not found in cart" });
        }
    } catch (error) {
        console.log("Delete Error:", error); // Check your terminal for the specific error
        return res.status(500).json({ message: "Server Error" });
    }
});

// @route GET /api/cart
exports.getUserCart = catchAsync(async (req, res, next) => {
    const { userId, guestId } = req.query;

    try {
        const cart = await getCart(userId, guestId);
        if (cart) {
            return res.json(cart);
        } else {
            return res.status(404).json({ message: "Cart not found" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server Error" });
    }
});

// @route POST /api/cart/merge
// Merge guest cart into user cart
// Access Private

exports.mergeCart = catchAsync(async (req, res) => {
    const { guestId } = req.body;

    // Defensive checks
    if (!guestId) {
        return res.status(400).json({ message: "guestId is required" });
    }
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "User not authenticated" });
    }

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ message: "Cart is empty" });
            }

            if (userCart) {
                // Merge guest cart into user cart
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.productId.toString() === guestItem.productId.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );
                await userCart.save();

                // Remove the guest cart after merging
                try {
                    await Cart.findOneAndDelete({ guestId });
                } catch (error) {
                    console.error("Error Deleting Cart:", error);
                }
                return res.status(200).json(userCart);
            } else {
                // If the user has no existing cart, assign the guest cart to the user
                guestCart.user = req.user._id;
                guestCart.guestId = undefined;
                await guestCart.save();

                return res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                return res.status(200).json(userCart);
            }
            return res.status(404).json({ message: "Guest cart not found" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server Error" });
    }
});