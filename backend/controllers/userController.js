const Product = require('../models/productModel');
const catchAsync = require('../middleware/catchAsyncError');
const User = require("../models/userModel");
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

// Register User 
exports.registerUser = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        name,
        email,
        password
    })
    sendToken(user, 201, res)
})

// Login User 
exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given the password or not 
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    sendToken(user, 200, res);
})

// Logout 
exports.logout = catchAsync(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

// Forget Password
exports.forgetPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    // Get resetToken
    const resetToken = user.getPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `You password reset token is: \n\n ${resetPasswordUrl} \n\n If you have not requested this email then plesae ignore it.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Buyzia Password Recovery`,
            message,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully.`
        })
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false })
        return next(new ErrorHandler(error.message, 500))
    }
})

exports.resentPassword = catchAsync(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }


    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    sendToken(user, 200, res)
})

// Get User Details
exports.getUserDetails = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user,
    });

})

// Update User Password
exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid Old Password, Please Try again", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password doesn't match", 400))
    }

    user.password = req.body.newPassword
    await user.save()

    sendToken(user, 200, res)
})

// Update User Profile
exports.updateProfile = catchAsync(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
    }

    // Cloudinary

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})

// Get All Users (Admin Only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});


// Get Single User -- (Admin)
exports.getSingleUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id}`, 404));

    }

    res.status(200).json({
        success: true,
        user,
    })
})

// Update User Role -- (Admin)
exports.updateUserRole = catchAsync(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    if (!user) {
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id}`, 404))
    }
    res.status(200).json({
        success: true,
        user
    })
});

// Delete User -- (Admin)
exports.deleteUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    // remove Cloudinary

    if (!user) {
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id}`, 400));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted Successfully!",
    })
})

// Create or Update the Review
exports.createProductReview = catchAsync(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Check if already reviewed
    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        // Update review
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString()) {
                rev.rating = rating;
                rev.comment = comment;
            }
        });
    } else {
        // Add new review
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Calculate average rating
    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });
    product.rating = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Review added/updated successfully",
    });
});

// Get all Reviews 
exports.getProductReviews = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.query.id);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    })
})

// Delete Reviews 
exports.deleteReview = catchAsync(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.i)

    let avg = 0;
    reviews.forEach((rev) => {
        avg += rev.rating;
    });
    const rating = avg / reviews.length;

    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        rating,
        numOfReviews
    }, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    })

    res.status(200).json({
        success: true,
    })
})
