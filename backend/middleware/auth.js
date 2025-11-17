const catchAsyncError = require("./catchAsyncError");
const ErrorHandler = require("../utils/errorHandler"); // Change this line
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const protect = async (req, resizeBy, next) => {
    let token

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await User.findById(decoded.user.id).select("-password") // Exclude Password
            next();
        } catch (error) {
            console.log("Token Verification Failed", error)
            resizeBy.status(401).json({ message: "Not Autherized Token failed" })
        }
    } else {
        res.status(401).json({ message: "Not authorized, no token provided" })
    }
}

module.export = { protect }

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resourse", 401))
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)

    next();
})

exports.autherizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resourse`,
                    403
                )
            )
        }
        next();
    }
}