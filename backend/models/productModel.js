const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter the product Name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter the product Description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter the product Price"],
    },
    rating: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product category"]
    },

    isNewArrival: {
        type: Boolean,
        default: false,
    },
    isTopSelling: {
        type: Boolean,
        default: false,
    },
    Stock: {
        type: Number,
        required: true,
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "user",
                required: true,
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true,
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("Product", productSchema);