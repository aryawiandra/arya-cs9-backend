const baseResponse = (res, success, status, message, payload) => {
    res.status(status).json({
        success,  
        message,
        payload,
    });
}

module.exports = (res, success, statusCode, message, data = null) => {
    res.status(statusCode).json({ success, message, data });
};

