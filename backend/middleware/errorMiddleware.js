const ErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Mongoose validation error - DYNAMIC MESSAGES
    if (err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map(val => val.message);
        const message = validationErrors.join(', '); // This will show ALL missing fields
        
        return res.status(400).json({
            success: false,
            message: message,
            errorType: 'VALIDATION_ERROR',
            details: validationErrors // Optional: show individual errors
        });
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        return res.status(404).json({
            success: false,
            message: message
        });
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        return res.status(400).json({
            success: false,
            message: message
        });
    }

    // Wrong JWT Error
    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web Token is invalid, try again`;
        return res.status(400).json({
            success: false,
            message: message
        });
    }

    // JWT Expire Error
    if (err.name === 'TokenExpireError') {
        const message = `Json Web Token is expired, try again`;
        return res.status(400).json({
            success: false,
            message: message
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
};

module.exports = ErrorHandler;