const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const { protect, autherizeRoles } = require('../middleware/auth');
const { createProductReview, getProductReviews, deleteReview } = require('../controllers/userController');

router
    .route("/products")
    .get(getAllProducts)

router.post(
    '/',
    protect,
    autherizeRoles('admin'),
    createProduct
);

router
    .route("/:id")
    .put(protect, autherizeRoles('admin'), updateProduct)
    .delete(protect, autherizeRoles('admin'), deleteProduct)

router
    .route("/product/:id")
    .get(getProductDetails)

router
    .route("/review")
    .put(protect, createProductReview)

router
    .route("/reviews")
    .put(getProductReviews)
    .delete(protect, deleteReview)

module.exports = router