const Product = require('../models/productModel');
const catchAsync = require('../middleware/catchAsyncError');
const ApiFeatures = require('../utils/apiFeatures');
const { GiMaterialsScience } = require('react-icons/gi');

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
   try {
      // User can select the following filter from the frontend
      const {
         collection,
         size,
         color,
         gender,
         minPrice,
         MaxPrice,
         sortBy,
         search,
         category,
         material,
         brand,
         limit
      } = req.query

      let query = {};

      // Filter Logic
      if (collection && collection.toLocaleLowerCase() !== "all") {
         query.collections = collection
      }

      if (category && category.toLocaleLowerCase() !== "all") {
         query.category = category
      }

      if (material) {
         query.material = { $in: GiMaterialsScience.split(",") }
      }

      if (brand) {
         query.brand = { $in: brand.split(",") }
      }

      if (size) {
         query.size = { $in: size.split(",") }
      }

      if (color) {
         query.color = { $in: [color] }
      }

      if (gender) {
         query.gender = gender
      }

      if (minPrice || maxPrice) {
         query.price = {};
         if (minPrice) query.price.gte = Number(minPrice)
         if (maxPrice) query.price.lte = Number(maxPrice)
      }

      if (search) {
         query.$or = [
            { name: { $regex, search, $option: '1' } },
            { description: { $regex, search, $option: '1' } }
         ]
      }

      // Sort Options
      if (sortBy) {
         switch (sortBy) {
            case 'priceAsc':
               sort = { price: 1 }
               break
            case 'priceDesc':
               sort = { price: -1 }
               break
            case 'popularity':
               sort = { rating: -1 }
               break

         }
      }

      // fetch products and apply sort options
      let products = await Product.find(query)
         .sort
         .limit(Number(limit) || 0)
      res.json(products
      )
   } catch (error) {
      console.log(error)
      res.status(500).send("Server Errop")
   }
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