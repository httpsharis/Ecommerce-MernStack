const Product = require('../models/productModel');
const connectDatabase = require('../config/database');
const products = require('./productData');
require('dotenv').config();

const seedProducts = async () => {
    try {
        await connectDatabase();

        console.log('Deleting existing products...');
        await Product.deleteMany();

        console.log('Inserting new products...');
        await Product.insertMany(products);

        console.log('Products seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();