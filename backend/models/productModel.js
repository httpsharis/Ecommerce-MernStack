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

    discountPrice: {
        type: Number,
    },

    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },

    sku: {
        type: String,
        unique: true,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    brand: {
        type: String,
    },

    sizes: {
        type: [String],
        required: true,
    },

    colors: {
        type: [String],
        required: true,
    },

    collections: {
        type: [String],
        required: true,
    },

    materials: {
        type: String,
    },

    gender: {
        type: String,
        enum: ["Men", "Women", "Unisex"]
    },

    images: [
        {
            url: {
                type: String,
                required: true,
            },
            altText: {
                type: String
            },
        },
    ],

    isFeatured: {
        type: Boolean,
        default: false,
    },

    isPublished: {
        type: Boolean,
        default: false,
    },

    numReviews: {
        type: Number,
        default: 0,
    },

    rating: {
        type: Number,
        default: 0,
    },

    tags: [String],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    metaTitle: {
        type: String,
    },

    metaDescription: {
        type: String,
    },

    metaKeywords: {
        type: String,
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number,
    },

    weight: Number,

},
    { timestamps: true }
)

module.exports = mongoose.model("Product", productSchema);