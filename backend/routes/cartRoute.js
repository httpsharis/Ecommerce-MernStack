const express = require("express")
const router = express.Router();

const { protect } = require("./../middleware/auth");
const { addProductInCart, updateQuantity, deleteCartProduct, getUserCart, mergeCart } = require("../controllers/cartController");

router
    .route("/")
    .get(getUserCart)
    .post(addProductInCart)
    .put(updateQuantity)
    .delete(deleteCartProduct);

router
    .route("/merge")
    .post(protect, mergeCart)

module.exports = router;