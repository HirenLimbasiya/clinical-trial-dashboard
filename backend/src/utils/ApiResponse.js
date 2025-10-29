/**
 * API Response Utility
 * Standardizes API response format across the application
 */

const { HTTP_STATUS } = require("../config/constants");

class ApiResponse {
  /**
   * Send success response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {string} message - Success message
   * @param {number} statusCode - HTTP status code (default: 200)
   */
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

  /**
   * Send error response
   * @param {Object} res - Express response object
   * @param {string} message - Error message
   * @param {number} statusCode - HTTP status code (default: 400)
   * @param {*} errors - Additional error details
   */
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

  /**
   * Send paginated response
   * @param {Object} res - Express response object
   * @param {*} data - Response data
   * @param {Object} pagination - Pagination metadata
   * @param {string} message - Success message
   */
  static paginated(res, data, pagination, message = "Success") {
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
      pagination,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Send created response
   * @param {Object} res - Express response object
   * @param {*} data - Created resource data
   * @param {string} message - Success message
   */
  static created(res, data, message = "Resource created successfully") {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  /**
   * Send no content response
   * @param {Object} res - Express response object
   */
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
