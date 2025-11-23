const app = require('./app.js')
const dotenv = require('dotenv')
const connectDatabase = require('./config/database.js')

// Handling Uncaught Execption
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to Uncaught Exception`)
    console.log()
})

// Config path
dotenv.config({ path: "./backend/config/config.env" });

// Connecting to the database - Note call after dotenv.config
connectDatabase();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on https://localhost:${process.env.PORT}`);
})

// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`)
    console.log(`Shutting down the server due to unhandled promise rejection`)
    server.close(() => {
        process.exit(1)
    })
})