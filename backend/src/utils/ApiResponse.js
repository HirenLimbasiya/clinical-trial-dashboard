const { HTTP_STATUS } = require("../config/constants");

class ApiResponse {
  static success(
    res,
    data = null,
    message = "Success",
    statusCode = HTTP_STATUS.OK
  ) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static error(
    res,
    message = "Error",
    statusCode = HTTP_STATUS.BAD_REQUEST,
    errors = null
  ) {
    const response = {
      success: false,
      error: {
        message,
        statusCode,
      },
      timestamp: new Date().toISOString(),
    };

    if (errors) {
      response.error.details = errors;
    }

    return res.status(statusCode).json(response);
  }

  static paginated(res, data, pagination, message = "Success") {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
      pagination,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  static created(res, data, message = "Resource created successfully") {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
