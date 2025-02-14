module.exports = (req, res, next) => {
  res.errorResponse = (errorMessage, code = 500, readableMessage = null) => {
    res.status(code).json({
      error: errorMessage,
      code: code,
      readable_message: readableMessage || errorMessage,
    });
  };

  res.successResponse = (
    data,
    message = "Operation successful",
    readable_message = null
  ) => {
    res.json({
      success: true,
      message: message,
      data: data,
      readable_message: readable_message || message,
    });
  };

  next();
};
