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
         weight,
         sku,
      } = req.body

      // Finding product in the database
      const product = await Product.findById(req.params.id)

      if (product) {
         // update product fields
         product.name = name || product.name
         product.description = description || product.description
         product.price = price || product.price
         product.discountPrice = discountPrice || product.discountPrice
         product.countInStock = countInStock || product.countInStock
         product.category = category || product.category
         product.brand = brand || product.brand
         product.sizes = sizes || product.sizes
         product.colors = colors || product.colors
         product.collections = collections || product.collections
         product.gender = gender || product.gender
         product.materials = materials || product.materials
         product.images = images || product.images
         product.isFeatured = isFeatured !== 'undefined' ? isFeatured : product.isFeatured
         product.isPublished = isPublished !== 'undefined' ? isPublished : product.isPublished
         product.tags = tags || product.tags
         product.dimensions = dimensions || product.dimensions
         product.weight = weight || product.weight
         product.sku = sku || product.sku

         // saving the update in the database
         const updateProduct = await product.save()
         res.json(updateProduct)
      } else {
         res.status(404).json({ message: "Product not found" })
      }
   } catch (error) {
      console.log(error);
      res.status(500).send("Server Error")
   }
});

// 🟥 DELETE PRODUCT
exports.deleteProduct = catchAsync(async (req, res, next) => {
   try {
      const product = await Product.findById(req.params.id);

      if (product) {
         // Remove Product from DB
         await product.deleteOne();
         res.json({ message: "Product Deleted!" })
      } else {
         res.json({ message: "Product not found" })
      }

   } catch (error) {
      console.log(error)
      res.status(500).send("Server Error!")
   }
});

// Not using because we used that in the middleware "../middleware/catchAsyncError.js"