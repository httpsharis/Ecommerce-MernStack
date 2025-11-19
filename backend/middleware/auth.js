const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("../utils/errorHandler"); // Change this line
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Checks if the user is Aurthorized or not
exports.protect = async (req, res, next) => {
    let token = req.cookies.token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        console.log("Token Verification Failed", error);
        res.status(401).json({ message: "Not Authorized, Token failed" });
    }
}


// exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
//     const { token } = req.cookies;

//     if (!token) {
//         return next(new ErrorHandler("Please Login to access this resourse", 401))
//     }

//     const decodedData = jwt.verify(token, process.env.JWT_SECRET)
//     req.user = await User.findById(decodedData.id)

//     next();
// })

exports.autherizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Not authorized as admin" });
        }
        next();
    }
}