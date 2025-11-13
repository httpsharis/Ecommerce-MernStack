// Error is Nodes Default class we inharited Errorhandler from here which is actually our own class.
class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message) // super is constructor of error so we inharited it.
        this.statusCode = statusCode

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = ErrorHandler;