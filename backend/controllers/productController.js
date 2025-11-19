const Product = require('../models/productModel');
const catchAsync = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');

// 🟩 CREATE PRODUCT
exports.createProduct = catchAsync(async (req, res, next) => {
   try {
      const {
         name,
         description,
         price,
         discountPrice,
         countInStock,
         category,
         brand,
         sizes,
         colors,
         collections,
         materials,
         gender,
         images,
         isFeatured,
         isPublished,
         tags,
         dimensions,
         weights,
         sku,
      } = req.body

      const product = new Product({
         name,
         description,
         price,
         discountPrice,
         countInStock,
         category,
         brand,
         sizes,
         colors,
         collections,
         materials,
         gender,
         images,
         isFeatured,
         isPublished,
         tags,
         dimensions,
         weights,
         sku,
         user: req.user._id,
      })

      const createdProduct = await product.save();
      res.status(201).json(createdProduct)

   } catch (error) {
      console.log(error)
      res.status(500).send("Server Error");
   }
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