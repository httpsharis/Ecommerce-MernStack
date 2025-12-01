// Set NODE_ENV to production BEFORE loading anything
process.env.NODE_ENV = 'production';

const app = require('../backend/app.js');
const connectDatabase = require('../backend/config/database.js');

// Connect Database
connectDatabase();

module.exports = app;