const express = require("express")
const router = express.Router();

const { protect } = require("./../middleware/auth");
const { addProductInCart } = require("../controllers/cartController");

router
    .route("/")
    .post(addProductInCart)