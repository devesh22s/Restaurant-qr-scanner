export const SuccessResponse = (res, status, data, message = "Success") => {
    return res.status(status).json({
        success: true,
        message,
        data
    });
};

export const ErrorResponse = (res, status, message) => {
    return res.status(status).json({
        success: false,
        message
    });
};