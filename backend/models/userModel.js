const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

    role: {
        type: String,
        enum: ["customer", "admin"],
        default: "customer",
    },

    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        trim: true,
    },

    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please enter valid email address"] // Characters checks the user added the valid email containing . or @ etc
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
    },
},
    { timestamps: true }, // Its auto add createdAt and updatedAt 
)

// Password Hash Middleware
userSchema.pre("save", async function (next) {

    // Salt: A salt adds random string to the password making it unique so if the pass is same but the hash will never be due to this string.
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
    next();

})

// Compare Password 
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports = mongoose.model("User", userSchema)