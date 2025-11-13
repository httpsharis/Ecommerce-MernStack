const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImages = async (req, res) => {
    try {
        const { image } = req.body; // base64 image string
        
        if (!image) {
            return res.status(400).json({ 
                success: false, 
                message: 'No image provided' 
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: 'ecommerce-products', // organize in folder
            resource_type: 'auto',
            transformation: [
                { width: 800, height: 800, crop: 'limit' }, // resize
                { quality: 'auto' }, // optimize
                { format: 'auto' } // auto format
            ]
        });

        res.status(200).json({
            success: true,
            message: 'Image uploaded successfully',
            url: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Image upload failed',
            error: error.message
        });
    }
};

module.exports = { uploadImages };