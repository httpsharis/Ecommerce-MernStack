const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/productModel");
const User = require("./models/userModel");
const products = require("./data/products");
const Cart = require("./models/cartModel")

dotenv.config({ path: './backend/config/config.env' });

// Connect to MongoDB
mongoose.connect(process.env.DB_URI);

// Function to seed Data
const seedData = async () => {
    try {
        // Clear Existing Data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany()

        // Create a default admin User
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "1234567890",
            role: "admin"
        });

        // Assign the default user ID to each product
        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return { ...product, user: userID }
        });

        // Insert the product into the database
        await Product.insertMany(sampleProducts);

        console.log("Product data seeded successfully!")
        process.exit();
    } catch (error) {
        console.log("Error seeding data:", error)
        process.exit(1);
    }
}

seedData();