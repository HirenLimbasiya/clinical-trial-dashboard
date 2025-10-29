/**
 * Async Handler Utility
 * Wraps async route handlers to catch errors and pass to error middleware
 */

/**
 * Wrapper function for async route handlers
 * Eliminates the need for try-catch blocks in controllers
 * @param {Function} fn - Async function to wrap
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
