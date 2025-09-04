class ExpressError extends Error {
    constructor(statusCode, message) {
        super(message); // ✅ This is REQUIRED
        this.statusCode = statusCode;
        this.name = "ExpressError";
    }
}

module.exports = ExpressError;