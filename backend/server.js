const app = require('./app.js')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database.js')

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`)
})

// Config - load env file in development
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: "./backend/config/config.env" });
}

// Connecting to the database
connectDatabase();

// For local development only
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 7000;
    app.listen(PORT, () => {
        console.log(`Server is working on http://localhost:${PORT}`);
    })
}

// Export for Vercel
module.exports = app;