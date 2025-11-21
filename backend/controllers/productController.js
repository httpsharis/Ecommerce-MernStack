const Product = require('../models/productModel');
const catchAsync = require('../middleware/catchAsyncError');

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
   const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit
   } = req.query;

   const query = {};

   // Filter Logic
   if (collection && collection.toLowerCase() !== "all") {
      query.collections = { $in: Array.isArray(collection) ? collection : collection.split(",") };
   }

   if (category && category.toLowerCase() !== "all") {
      query.category = category;
   }

   if (material) {
      query.materials = { $in: material.split(",") };
   }

   if (brand) {
      query.brand = { $in: brand.split(",") };
   }

   if (size) {
      query.sizes = { $in: size.split(",") };
   }

   if (color) {
      query.colors = { $in: color.split(",") };
   }

   if (gender) {
      query.gender = gender;
   }

   if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
   }

   if (search) {
      query.$or = [
         { name: { $regex: search, $options: 'i' } },
         { description: { $regex: search, $options: 'i' } }
      ];
   }

   // Sort Options
   let sortObj = {};
   if (sortBy) {
      switch (sortBy) {
         case 'priceAsc':
            sortObj = { price: 1 };
            break;
         case 'priceDesc':
            sortObj = { price: -1 };
            break;
         case 'popularity':
            sortObj = { rating: -1 };
            break;
         default:
            sortObj = {};
      }
   }

   // Build and execute query
   let productsQuery = Product.find(query);

   if (Object.keys(sortObj).length > 0) {
      productsQuery = productsQuery.sort(sortObj);
   }

   if (limit) {
      productsQuery = productsQuery.limit(Number(limit));
   }

   const products = await productsQuery.exec();

   res.status(200).json({
      success: true,
      count: products.length,
      products
   });
});

// Get Product details
exports.getProductDetails = catchAsync(async (req, res, next) => {
   try {
      const product = await Product.findById(req.params.id);
      if (product) {
         res.json(product);
      } else {
         res.status(404).json({ message: "Product not found!" })
      }
   } catch (error) {
      console.log(error)
      res.status(500).send("Server Error!")
   }
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

// @route GET /api/products/similar/:id
// Retrives Similar Products based on the current product's gender and category
// @access Public
exports.getSimilarProducts = catchAsync(async (req, res, next) => {
   const { id } = req.params

   try {
      const product = await Product.findById(id);

      if (!product) {
         return res.status(404).json({ message: "Product not found" })
      }

      const similarProducts = await Product.find({
         _id: { $ne: id },
         gender: product.gender,
         category: product.category,
      }).limit(4);

      res.json(similarProducts)

   } catch (error) {
      console.log(error)
      res.status(500).send("Server Error")
   }
});

// @route GET /api/products/best-seller
// @desc Retrive the Rroduct with highest rating
// Access Public
exports.getBestSellers = catchAsync(async (req, res, next) => {
   try {
      const bestSeller = await Product.findOne().sort({ rating: -1 })
      if (bestSeller) {
         res.json(bestSeller)
      } else {
         res.status(404).json({ message: "Not best seller found" })
      }
   } catch (error) {
      console.log(error)
      res.status(500).json("Server Error")
   }
})

// @route GET /api/products/new-arrivals
// @desc Retrive the new added products
// Access Public
exports.getNewArrivals = catchAsync(async (req, res) => {
   try {
      // Fetch atleast 8 products
      const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
      res.json(newArrivals)
   } catch (error) {
      console.log(error)
      res.status(500).send("Server Error")
   }
})

// Not using because we used that in the middleware "../middleware/catchAsyncError.js"