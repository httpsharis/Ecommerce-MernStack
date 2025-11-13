const Product = require('../models/productModel');
const catchAsync = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');

// 🟩 CREATE PRODUCT
exports.createProduct = catchAsync(async (req, res, next) => {

    const imagePromises = req.files.map(file =>
        cloudinary.uploader.upload(file.path, {
            folder: 'products',
            width: 800,
            height: 800,
            crop: 'limit'
        })
    );

    const imageResult = await promise.all(imagePromises);

    const images = imageResult.map(result => ({
        public_id: result.public_id,
        url: result.secure_url
    }))

    req.body.images = images
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product
    });
});

// 🟨 GET ALL PRODUCTS
exports.getAllProducts = catchAsync(async (req, res, next) => {

    const resultPerPage = 8;

    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
});


// Get Product details
exports.getProductDetails = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found."
        });
    }

    res.status(200).json({
        success: true,
        product
    });
});

// 🟨 UPDATE PRODUCT
exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found."
        });
    }

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    });
});

// 🟥 DELETE PRODUCT
exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found."
        });
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});

// Not using because we used that in the middleware "../middleware/catchAsyncError.js"