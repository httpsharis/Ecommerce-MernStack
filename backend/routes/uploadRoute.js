const express = require("express")
const router = express.Router();
const multer = require("multer")
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier")
const path = require("path"); 

// ✅ Use absolute path to find config.env
require("dotenv").config({ path: path.join(__dirname, "../config/config.env") });

// Cloudinary Configurations
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Multer setup using memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })

router.post("/", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file Uploaded" })
        }

        // Function to handle the stream uplaod to Cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if (result) {
                        resolve(result)
                    } else {
                        reject(error)
                    }
                })

                // User Streamifier to convert file buffer into a stream
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }

        // Call the stream uplaod function
        const result = await streamUpload(req.file.buffer);

        // Respond with file upload image URL 
        res.json({ imageUrl: result.secure_url })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "server error" })
    }
})

module.exports = router;