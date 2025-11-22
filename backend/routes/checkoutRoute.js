const express = require("express")
const router = express.Router();

const { protect } = require("./../middleware/auth");
const { createCheckout, updateCheckout, finalizeCheckout } = require("../controllers/checkoutController");

router
    .route("/checkout")
    .post(protect, createCheckout)

router
    .route("/:id/pay")
    .put(protect, updateCheckout)

router
    .route("/:id/finalize")
    .post(protect, finalizeCheckout)