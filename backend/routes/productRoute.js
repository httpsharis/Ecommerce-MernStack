const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, getSimilarProducts, getBestSellers, getNewArrivals } = require('../controllers/productController');
const { protect, autherizeRoles } = require('../middleware/auth');
const { createProductReview, getProductReviews, deleteReview } = require('../controllers/userController');

router
    .route("/")
    .get(getAllProducts)

router.post(
    '/',
    protect,
    autherizeRoles('admin'),
    createProduct
);

router
    .route("/best-seller")
    .get(getBestSellers)

router
    .route("/new-arrivals")
    .get(getNewArrivals)

router
    .route("/:id")
    .put(protect, autherizeRoles('admin'), updateProduct)
    .delete(protect, autherizeRoles('admin'), deleteProduct)

router
    .route("/:id")
    .get(getProductDetails)

router
    .route("/similar/:id")
    .get(getSimilarProducts)

router
    .route("/review")
    .put(protect, createProductReview)

router
    .route("/reviews")
    .put(getProductReviews)
    .delete(protect, deleteReview)

module.exports = router