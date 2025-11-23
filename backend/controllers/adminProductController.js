const Product = require("./../models/productModel")
const catchAsync = require('../middleware/catchAsyncError');

// @route GET /api/admin/products
// Get all products
// @access Private
exports.adminGetAllProducts = catchAsync(async (req, res) => {
    try {
        const products = await Product.find({})
        res.json(products)
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" })
    }
})