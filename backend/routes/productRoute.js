const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require('../controllers/productController');
const { isAuthenticatedUser, autherizeRoles } = require('../middleware/auth');
const { createProductReview, getProductReviews, deleteReview } = require('../controllers/userController');

router
    .route("/products")
    .get(getAllProducts)

router.post(
    '/admin/product/new',
    isAuthenticatedUser,
    autherizeRoles('admin'),
    upload.array('images', 5),
    createProduct
);

router
    .route("/admin/product/:id")
    .put(isAuthenticatedUser, autherizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, autherizeRoles('admin'), deleteProduct)

router
    .route("/product/:id")
    .get(getProductDetails)

router
    .route("/review")
    .put(isAuthenticatedUser, createProductReview)

router
    .route("/reviews")
    .put(getProductReviews)
    .delete(isAuthenticatedUser, deleteReview)

module.exports = router