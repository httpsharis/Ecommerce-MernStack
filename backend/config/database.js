const mongoose = require('mongoose')

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URI, {
      
    }).then((data) => {
        console.log(`MongoDB is connected with the server ${data.connection.host}`)
    }).catch((err) => {
        console.error("MongoDB connection error:", err.message);
    })

}

module.exports = connectDatabase