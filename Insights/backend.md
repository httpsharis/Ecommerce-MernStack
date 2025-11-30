# 📚 MERN Stack E-Commerce Backend Notes

## **Table of Contents**
1. [Project Structure](#1-project-structure)
2. [Express Server Setup](#2-express-server-setup)
3. [MongoDB & Mongoose](#3-mongodb--mongoose)
4. [Authentication & Authorization](#4-authentication--authorization)
5. [Controllers Pattern](#5-controllers-pattern)
6. [Routes Setup](#6-routes-setup)
7. [Middleware](#7-middleware)
8. [File Uploads](#8-file-uploads)
9. [Error Handling](#9-error-handling)
10. [Environment Variables](#10-environment-variables)
11. [Useful Code Snippets](#11-useful-code-snippets)

---

## **1. Project Structure**

```
backend/
├── config/
│   └── db.js                # Database connection
├── controllers/
│   ├── userController.js    # User logic
│   ├── productController.js # Product logic
│   ├── orderController.js   # Order logic
│   ├── adminController.js   # Admin logic
│   └── uploadController.js  # File upload logic
├── middleware/
│   └── auth.js              # Authentication middleware
├── models/
│   ├── userModel.js         # User schema
│   ├── productModel.js      # Product schema
│   ├── orderModel.js        # Order schema
│   └── cartModel.js         # Cart schema
├── routes/
│   ├── userRoutes.js        # User routes
│   ├── productRoutes.js     # Product routes
│   ├── orderRoutes.js       # Order routes
│   ├── adminRoutes.js       # Admin routes
│   └── uploadRoutes.js      # Upload routes
├── uploads/                  # Uploaded files directory
├── .env                      # Environment variables
├── server.js                 # Entry point
└── package.json
```

---

## **2. Express Server Setup**

### **2.1 Basic Server Configuration**

```javascript
// filepath: backend/server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// 📌 Middleware
app.use(express.json());                    // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// 📌 CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,                      // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 📌 Static Files (for uploads)
app.use('/uploads', express.static('uploads'));

// 📌 Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// 📌 Health Check Route
app.get('/', (req, res) => {
    res.json({ message: 'API is running...' });
});

// 📌 Error Handler (must be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false,
        message: err.message || 'Server Error' 
    });
});

// 📌 Start Server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
```

### **2.2 Database Connection**

```javascript
// filepath: backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        process.exit(1);  // Exit with failure
    }
};

module.exports = connectDB;
```

---

## **3. MongoDB & Mongoose**

### **3.1 Schema Basics**

```javascript
// filepath: backend/models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // 📌 String field with validation
    name: {
        type: String,
        required: [true, 'Please enter your name'],  // Custom error message
        trim: true,                                   // Remove whitespace
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    
    // 📌 Email with unique constraint
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,                                 // No duplicates
        lowercase: true,                              // Convert to lowercase
        match: [/^\S+@\S+\.\S+$/, 'Please enter valid email']  // Regex validation
    },
    
    // 📌 Password (will be hashed)
    password: {
        type: String,
        required: [true, 'Please enter password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false                                 // Don't include in queries by default
    },
    
    // 📌 Enum field (predefined values)
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    
    // 📌 Boolean field
    isVerified: {
        type: Boolean,
        default: false
    },
    
    // 📌 Array of strings
    wishlist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'                               // Reference to Product model
    }],
    
}, {
    timestamps: true  // 📌 Adds createdAt and updatedAt automatically
});

// 📌 Pre-save middleware - Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// 📌 Instance method - Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

### **3.2 Complex Schema (Product)**

```javascript
// filepath: backend/models/productModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true
    },
    
    description: {
        type: String,
        required: [true, 'Please enter product description']
    },
    
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        min: [0, 'Price cannot be negative']
    },
    
    // 📌 Nested object for images
    images: [{
        url: {
            type: String,
            required: true
        },
        altText: {
            type: String,
            default: ''
        }
    }],
    
    // 📌 Array of strings
    sizes: [{
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    }],
    
    colors: [{
        type: String
    }],
    
    category: {
        type: String,
        required: true
    },
    
    brand: {
        type: String
    },
    
    material: {
        type: String
    },
    
    gender: {
        type: String,
        enum: ['Men', 'Women', 'Unisex']
    },
    
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    
    sku: {
        type: String,
        unique: true,
        required: true
    },
    
    // 📌 Reference to another model
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // 📌 Nested array of objects (reviews)
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    
    // 📌 Calculated fields
    averageRating: {
        type: Number,
        default: 0
    },
    
    numReviews: {
        type: Number,
        default: 0
    },
    
    isFeatured: {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true });

// 📌 Index for search performance
productSchema.index({ name: 'text', description: 'text' });

// 📌 Virtual field (not stored in DB)
productSchema.virtual('isInStock').get(function() {
    return this.countInStock > 0;
});

module.exports = mongoose.model('Product', productSchema);
```

### **3.3 Order Schema (References)**

```javascript
// filepath: backend/models/orderModel.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // 📌 Reference to User
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    // 📌 Array of order items
    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        image: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        size: String,
        color: String
    }],
    
    // 📌 Nested object
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String }
    },
    
    paymentMethod: {
        type: String,
        required: true,
        enum: ['COD', 'Card', 'PayPal', 'Stripe']
    },
    
    paymentResult: {
        id: String,
        status: String,
        updateTime: String,
        emailAddress: String
    },
    
    // 📌 Price breakdown
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    
    // 📌 Order status
    status: {
        type: String,
        enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Processing'
    },
    
    isPaid: {
        type: Boolean,
        default: false
    },
    
    paidAt: {
        type: Date
    },
    
    isDelivered: {
        type: Boolean,
        default: false
    },
    
    deliveredAt: {
        type: Date
    }
    
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
```

### **3.4 Common Mongoose Queries**

```javascript
// 📌 Find all
const products = await Product.find();

// 📌 Find with conditions
const activeProducts = await Product.find({ countInStock: { $gt: 0 } });

// 📌 Find one by ID
const product = await Product.findById(id);

// 📌 Find one with conditions
const user = await User.findOne({ email: email });

// 📌 Find with select (specific fields)
const user = await User.findById(id).select('name email role');

// 📌 Find with select and include password
const user = await User.findOne({ email }).select('+password');

// 📌 Populate references
const order = await Order.findById(id)
    .populate('user', 'name email')           // Populate user with name and email
    .populate('orderItems.product', 'name price');  // Populate product in orderItems

// 📌 Sort
const products = await Product.find().sort({ createdAt: -1 }); // Newest first
const products = await Product.find().sort({ price: 1 });      // Lowest price first

// 📌 Limit and Skip (Pagination)
const page = 1;
const limit = 10;
const products = await Product.find()
    .skip((page - 1) * limit)
    .limit(limit);

// 📌 Count documents
const totalProducts = await Product.countDocuments();
const activeCount = await Product.countDocuments({ countInStock: { $gt: 0 } });

// 📌 Create
const newProduct = await Product.create({
    name: 'Product Name',
    price: 99.99,
    // ... other fields
});

// 📌 Update by ID
const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { name: 'New Name', price: 149.99 },
    { new: true, runValidators: true }  // Return updated doc, run validations
);

// 📌 Update with $set
await Product.findByIdAndUpdate(id, {
    $set: { isFeatured: true }
});

// 📌 Update array - Push
await User.findByIdAndUpdate(userId, {
    $push: { wishlist: productId }
});

// 📌 Update array - Pull (remove)
await User.findByIdAndUpdate(userId, {
    $pull: { wishlist: productId }
});

// 📌 Delete by ID
await Product.findByIdAndDelete(id);

// 📌 Delete many
await Product.deleteMany({ category: 'Old Category' });

// 📌 Aggregation
const stats = await Order.aggregate([
    {
        $group: {
            _id: null,
            totalSales: { $sum: '$totalPrice' },
            totalOrders: { $sum: 1 },
            avgOrderValue: { $avg: '$totalPrice' }
        }
    }
]);

// 📌 Text search
const results = await Product.find({
    $text: { $search: 'keyword' }
});
```

---

## **4. Authentication & Authorization**

### **4.1 JWT Token Generation**

```javascript
// filepath: backend/controllers/userController.js

const jwt = require('jsonwebtoken');

// 📌 Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },                        // Payload
        process.env.JWT_SECRET,                // Secret key
        { expiresIn: process.env.JWT_EXPIRE || '30d' }  // Expiry
    );
};

// 📌 Login Controller
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Compare password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        user.password = undefined;

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
```

### **4.2 Auth Middleware**

```javascript
// filepath: backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 📌 Protect Routes - Check if user is logged in
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no token provided'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token invalid'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// 📌 Authorize Roles - Check user role
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    };
};

// 📌 Alternative: Single role check
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
    next();
};
```

### **4.3 Using Auth Middleware in Routes**

```javascript
// filepath: backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const { 
    getAllUsers, 
    deleteUser, 
    updateUserRole 
} = require('../controllers/adminController');

// 📌 All routes here require: logged in + admin role
router.use(protect);                    // Apply to all routes below
router.use(authorizeRoles('admin'));    // Apply to all routes below

router.route('/users')
    .get(getAllUsers);

router.route('/users/:id')
    .put(updateUserRole)
    .delete(deleteUser);

module.exports = router;

// 📌 Alternative: Apply middleware per route
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.delete('/users/:id', protect, authorizeRoles('admin'), deleteUser);
```

---

## **5. Controllers Pattern**

### **5.1 Basic Controller Structure**

```javascript
// filepath: backend/controllers/productController.js

const Product = require('../models/productModel');

// 📌 GET all products
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        
        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// 📌 GET single product
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            });
        }
        
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// 📌 CREATE product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
    try {
        // Add user from auth middleware
        req.body.createdBy = req.user._id;
        
        const product = await Product.create(req.body);
        
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Product with this SKU already exists'
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }
        
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// 📌 UPDATE product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,           // Return updated document
                runValidators: true  // Run model validations
            }
        );
        
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// 📌 DELETE product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }
        
        await Product.findByIdAndDelete(req.params.id);
        
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
```

### **5.2 Controller with Query Features**

```javascript
// 📌 Advanced GET with filtering, sorting, pagination
// @route   GET /api/products
// @access  Public
exports.getAllProducts = async (req, res) => {
    try {
        // 📌 Build query
        let query = {};
        
        // Filter by category
        if (req.query.category) {
            query.category = req.query.category;
        }
        
        // Filter by gender
        if (req.query.gender) {
            query.gender = req.query.gender;
        }
        
        // Filter by price range
        if (req.query.minPrice || req.query.maxPrice) {
            query.price = {};
            if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
        }
        
        // Filter in stock only
        if (req.query.inStock === 'true') {
            query.countInStock = { $gt: 0 };
        }
        
        // Search by keyword
        if (req.query.keyword) {
            query.$or = [
                { name: { $regex: req.query.keyword, $options: 'i' } },
                { description: { $regex: req.query.keyword, $options: 'i' } }
            ];
        }
        
        // 📌 Sorting
        let sortBy = { createdAt: -1 };  // Default: newest first
        
        if (req.query.sort) {
            switch (req.query.sort) {
                case 'price_asc':
                    sortBy = { price: 1 };
                    break;
                case 'price_desc':
                    sortBy = { price: -1 };
                    break;
                case 'name_asc':
                    sortBy = { name: 1 };
                    break;
                case 'rating':
                    sortBy = { averageRating: -1 };
                    break;
            }
        }
        
        // 📌 Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // 📌 Execute query
        const products = await Product.find(query)
            .sort(sortBy)
            .skip(skip)
            .limit(limit);
        
        // Get total count for pagination
        const total = await Product.countDocuments(query);
        
        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            products
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
```

---

## **6. Routes Setup**

### **6.1 Basic Routes**

```javascript
// filepath: backend/routes/productRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// 📌 Public routes
router.route('/')
    .get(getAllProducts);                                    // GET /api/products

router.route('/:id')
    .get(getProductById);                                    // GET /api/products/:id

// 📌 Protected routes (Admin only)
router.route('/')
    .post(protect, authorizeRoles('admin'), createProduct);  // POST /api/products

router.route('/:id')
    .put(protect, authorizeRoles('admin'), updateProduct)    // PUT /api/products/:id
    .delete(protect, authorizeRoles('admin'), deleteProduct); // DELETE /api/products/:id

module.exports = router;
```

### **6.2 User Routes**

```javascript
// filepath: backend/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    changePassword
} = require('../controllers/userController');

// 📌 Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// 📌 Protected routes
router.post('/logout', protect, logoutUser);
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);
router.put('/password', protect, changePassword);

module.exports = router;
```

### **6.3 Admin Routes**

```javascript
// filepath: backend/routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/auth');
const {
    getAllUsers,
    getSingleUser,
    addUser,
    updateUserRole,
    deleteUser,
    getAllOrders,
    updateOrderStatus,
    deleteProduct,
    updateProduct
} = require('../controllers/adminController');

// 📌 All admin routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles('admin'));

// User management
router.route('/users')
    .get(getAllUsers)
    .post(addUser);

router.route('/users/:id')
    .get(getSingleUser)
    .put(updateUserRole)
    .delete(deleteUser);

// Order management
router.route('/orders')
    .get(getAllOrders);

router.route('/orders/:id')
    .put(updateOrderStatus);

// Product management
router.route('/products/:id')
    .put(updateProduct)
    .delete(deleteProduct);

module.exports = router;
```

---

## **7. Middleware**

### **7.1 Custom Middleware Examples**

```javascript
// filepath: backend/middleware/customMiddleware.js

// 📌 Logger Middleware
exports.logger = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`);
    next();
};

// 📌 Request Time Middleware
exports.requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
};

// 📌 Validate ObjectId Middleware
const mongoose = require('mongoose');

exports.validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid ID format'
        });
    }
    next();
};

// 📌 Rate Limiter (basic)
const requestCounts = new Map();

exports.rateLimiter = (limit = 100, windowMs = 60000) => {
    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();
        
        if (!requestCounts.has(ip)) {
            requestCounts.set(ip, { count: 1, startTime: now });
            return next();
        }
        
        const record = requestCounts.get(ip);
        
        if (now - record.startTime > windowMs) {
            requestCounts.set(ip, { count: 1, startTime: now });
            return next();
        }
        
        if (record.count >= limit) {
            return res.status(429).json({
                success: false,
                message: 'Too many requests, please try again later'
            });
        }
        
        record.count++;
        next();
    };
};
```

### **7.2 Using Middleware**

```javascript
// filepath: backend/server.js

const { logger, requestTime } = require('./middleware/customMiddleware');

// Apply globally
app.use(logger);
app.use(requestTime);

// Apply to specific routes
app.use('/api/products', validateObjectId, productRoutes);
```

---

## **8. File Uploads**

### **8.1 Multer Configuration**

```javascript
// filepath: backend/config/multer.js

const multer = require('multer');
const path = require('path');

// 📌 Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Upload directory
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 📌 File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// 📌 Upload middleware
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
```

### **8.2 Upload Controller**

```javascript
// filepath: backend/controllers/uploadController.js

const path = require('path');
const fs = require('fs');

// 📌 Single file upload
// @route   POST /api/upload
// @access  Private
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }
        
        // Generate URL for the uploaded file
        const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            url: url,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Upload failed'
        });
    }
};

// 📌 Multiple files upload
exports.uploadMultipleImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No files uploaded'
            });
        }
        
        const urls = req.files.map(file => ({
            url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
            filename: file.filename
        }));
        
        res.status(200).json({
            success: true,
            message: 'Files uploaded successfully',
            files: urls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Upload failed'
        });
    }
};

// 📌 Delete file
exports.deleteImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const filepath = path.join(__dirname, '../uploads', filename);
        
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            res.status(200).json({
                success: true,
                message: 'File deleted successfully'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Delete failed'
        });
    }
};
```

### **8.3 Upload Routes**

```javascript
// filepath: backend/routes/uploadRoutes.js

const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { protect } = require('../middleware/auth');
const {
    uploadImage,
    uploadMultipleImages,
    deleteImage
} = require('../controllers/uploadController');

// Single file upload
router.post('/', protect, upload.single('image'), uploadImage);

// Multiple files upload (max 5)
router.post('/multiple', protect, upload.array('images', 5), uploadMultipleImages);

// Delete file
router.delete('/:filename', protect, deleteImage);

module.exports = router;
```

---

## **9. Error Handling**

### **9.1 Custom Error Class**

```javascript
// filepath: backend/utils/errorResponse.js

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;
```

### **9.2 Async Handler Wrapper**

```javascript
// filepath: backend/middleware/asyncHandler.js

// 📌 Wrap async functions to catch errors
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// 📌 Usage in controller:
const asyncHandler = require('../middleware/asyncHandler');

exports.getProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();
    
    res.status(200).json({
        success: true,
        products
    });
});
// No need for try-catch!
```

### **9.3 Global Error Handler**

```javascript
// filepath: backend/middleware/errorHandler.js

const ErrorResponse = require('../utils/errorResponse');

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    
    // Log error for debugging
    console.error('Error:', err);
    
    // 📌 Mongoose Bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Resource not found';
        error = new ErrorResponse(message, 404);
    }
    
    // 📌 Mongoose Duplicate Key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `Duplicate value entered for ${field}`;
        error = new ErrorResponse(message, 400);
    }
    
    // 📌 Mongoose Validation Error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }
    
    // 📌 JWT Error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = new ErrorResponse(message, 401);
    }
    
    // 📌 JWT Expired
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = new ErrorResponse(message, 401);
    }
    
    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = errorHandler;
```

### **9.4 Using Error Handler in Server**

```javascript
// filepath: backend/server.js

const errorHandler = require('./middleware/errorHandler');

// ... routes ...

// 📌 Error handler must be LAST
app.use(errorHandler);
```

---

## **10. Environment Variables**

### **10.1 .env File**

```env
# filepath: backend/.env

# Server
NODE_ENV=development
PORT=7000

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=30d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880

# Cloudinary (optional - for cloud storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### **10.2 Accessing Environment Variables**

```javascript
// Load at the top of server.js
require('dotenv').config();

// Access variables
const port = process.env.PORT || 7000;
const mongoUri = process.env.MONGO_URI;
const jwtSecret = process.env.JWT_SECRET;

// Check required variables
if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is required');
    process.exit(1);
}
```

---

## **11. Useful Code Snippets**

### **11.1 Complete User Controller**

```javascript
// filepath: backend/controllers/userController.js

const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user with password
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Profile updated',
            user
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
```

### **11.2 Complete Admin Controller**

```javascript
// filepath: backend/controllers/adminController.js

const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// ==================== USER MANAGEMENT ====================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getSingleUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Add new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.addUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'customer'
        });

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Add user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated',
            user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// ==================== ORDER MANAGEMENT ====================

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        // Calculate totals
        const totalOrders = orders.length;
        const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        res.status(200).json({
            success: true,
            totalOrders,
            totalSales,
            orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        await order.save();

        // Populate user for response
        const updatedOrder = await Order.findById(req.params.id)
            .populate('user', 'name email');

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            order: updatedOrder
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// ==================== PRODUCT MANAGEMENT ====================

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Product updated',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
};
```

---

## **Quick Reference Cheat Sheet**

| Task | Code |
|------|------|
| Get all | `Model.find()` |
| Get by ID | `Model.findById(id)` |
| Get one | `Model.findOne({ field: value })` |
| Create | `Model.create(data)` |
| Update | `Model.findByIdAndUpdate(id, data, { new: true })` |
| Delete | `Model.findByIdAndDelete(id)` |
| Populate | `.populate('field', 'select fields')` |
| Sort | `.sort({ field: -1 })` |
| Limit | `.limit(10)` |
| Skip | `.skip(10)` |
| Count | `Model.countDocuments(query)` |
| Select fields | `.select('field1 field2')` |
| Exclude field | `.select('-password')` |
| Include hidden | `.select('+password')` |

---

## **HTTP Status Codes**

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error, missing fields |
| 401 | Unauthorized | Not logged in, invalid token |
| 403 | Forbidden | Logged in but not allowed |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Unexpected error |

---

## **Response Format**

```javascript
// Success response
res.status(200).json({
    success: true,
    message: 'Operation successful',
    data: { ... }
});

// Error response
res.status(400).json({
    success: false,
    message: 'Error description'
});

// List response
res.status(200).json({
    success: true,
    count: items.length,
    total: totalCount,
    page: currentPage,
    pages: totalPages,
    items: [ ... ]
});
```

---

## **Key Takeaways**

1. **Express** is the web framework for handling HTTP requests
2. **Mongoose** provides schema validation and MongoDB interactions
3. **JWT tokens** are used for stateless authentication
4. **Middleware** functions run before route handlers
5. **Controllers** contain the business logic
6. **Routes** define API endpoints and link to controllers
7. **Models** define data structure with Mongoose schemas
8. **bcrypt** is used to hash passwords securely
9. **Multer** handles file uploads
10. **CORS** allows frontend to communicate with backend
11. **Environment variables** keep secrets safe
12. **Error handling** should be consistent across the API

---

**Happy Coding! 🚀**