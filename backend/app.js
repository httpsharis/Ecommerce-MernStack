const express = require('express');
const app = express()
const errorMiddleware = require('./middleware/errorMiddleware');
const cookieParser = require('cookie-parser');
const cors = require('cors')

app.use(express.json());
app.use(cookieParser())

// Parse URL-encoded bodies (for POST/PUT/PATCH)
app.use(express.urlencoded({ extended: true }));

// Route Imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute')
const cart = require('./routes/cartRoute')
const checkout = require('./routes/checkoutRoute')
const upload = require('./routes/uploadRoute')

app.use("/api/products", product)
app.use("/api/user", user)
app.use("/api/order", order)
app.use("/api/cart", cart)
app.use("/api/checkout", checkout)
app.use("/api/upload", upload)

// Middleware for errors
app.use(errorMiddleware)


module.exports = app