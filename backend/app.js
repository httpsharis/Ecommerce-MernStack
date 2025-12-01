const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/errorMiddleware');

// Middleware
app.use(express.json());
app.use(cookieParser());

// Middleware to log origin for debugging
app.use((req, res, next) => {
    console.log('Request Origin:', req.headers.origin);
    next();
});

// CORS
const corsOptions = {
    origin: [
        'http://localhost:5173',
        process.env.FRONTEND_URL,
        /https:\/\/ecom-mernstack-frontend.*\.vercel\.app$/
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Explicitly handle preflight requests

// ✅ Test route - Add this at the top
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is running...'
    });
});

// Route Imports
const product = require('./routes/productRoute');
const user = require('./routes/userRoute');
const order = require('./routes/orderRoute')
const cart = require('./routes/cartRoute')
const checkout = require('./routes/checkoutRoute')
const upload = require('./routes/uploadRoute')
const subscribe = require('./routes/subcriberRoute')
const authRoutes = require('./routes/authRoute')

const admin = require('./routes/adminRoutes')
const adminProducts = require('./routes/adminProductRoute')
const adminOrders = require('./routes/adminOrderRoute')

app.use("/api/products", product)
app.use("/api/user", user)
app.use("/api/order", order)
app.use("/api/cart", cart)
app.use("/api/checkout", checkout)
app.use("/api/upload", upload)
app.use("/api/subscribe", subscribe)
app.use('/api/auth', authRoutes); // ✅ Add this line

app.use("/api/admin", admin)
app.use("/api/admin/products", adminProducts)
app.use("/api/admin", adminOrders)

// Middleware for errors
app.use(errorMiddleware)

module.exports = app