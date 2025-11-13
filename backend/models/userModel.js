const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({

    role: {
        type: String,
        default: "user",
    },

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name can not exceed more then 30 characters"],
        minLength: [4, "Name should've more then 4 characters"]
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"]
    },

    password: {
        type: String,
        required: [true, "Please Enter your password"],
        minLength: [8, "Password should me more the 8 characters"],
        select: false //This means that when checking the User info this info will not be added
    },

    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        next();
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

// Compare Password 
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// Generating Password reset Token
userSchema.methods.getPasswordResetToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hashing and add ResetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken
}

module.exports = mongoose.model("User", userSchema)