const analyticsService = require("../services/analyticsService");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const { HTTP_STATUS, CACHE_DURATION } = require("../config/constants");

exports.getLocationDistribution = asyncHandler(async (req, res) => {
  const data = await analyticsService.getLocationDistribution();

  // Set cache headers for better performance
  res.set("Cache-Control", `public, max-age=${CACHE_DURATION.SHORT}`);

  ApiResponse.success(
    res,
    data,
    "Location distribution retrieved successfully"
  );
});

/**
 * @route   GET /api/analytics/demographics
 * @desc    Get participant demographics (sex and age distribution)
 */
exports.getDemographics = asyncHandler(async (req, res) => {
  const data = await analyticsService.getDemographics();

  // Set cache headers
  res.set("Cache-Control", `public, max-age=${CACHE_DURATION.SHORT}`);

  ApiResponse.success(res, data, "Demographics retrieved successfully");
});

/**
 * @route   GET /api/analytics/trials-per-city
 * @desc    Get number of trials per city (top cities)
 * @query   limit - Number of top cities to return (default: 10)
 */
exports.getTrialsPerCity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  // Validate limit
  if (limit < 1 || limit > 100) {
    return ApiResponse.error(
      res,
      "Limit must be between 1 and 100",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const data = await analyticsService.getTrialsPerCity(limit);

  // Set cache headers
  res.set("Cache-Control", `public, max-age=${CACHE_DURATION.SHORT}`);

  ApiResponse.success(res, data, "Trials per city retrieved successfully");
});

/**
 * @route   GET /api/analytics/officials
 * @desc    Get overall officials with pagination
 * @query   page - Page number (default: 1)
 * @query   limit - Items per page (default: 10)
 */
exports.getOfficials = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (page < 1) {
    return ApiResponse.error(
      res,
      "Page must be greater than 0",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (limit < 1 || limit > 100) {
    return ApiResponse.error(
      res,
      "Limit must be between 1 and 100",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const data = await analyticsService.getOfficials(page, limit);

  // Set cache headers
  res.set("Cache-Control", `public, max-age=${CACHE_DURATION.SHORT}`);

  ApiResponse.success(res, data, "Officials retrieved successfully");
});

/**
 * @route   GET /api/analytics/summary
 * @desc    Get summary statistics
 */
exports.getSummaryStats = asyncHandler(async (req, res) => {
  const data = await analyticsService.getSummaryStats();

  // Set cache headers
  res.set("Cache-Control", `public, max-age=${CACHE_DURATION.SHORT}`);

  ApiResponse.success(res, data, "Summary statistics retrieved successfully");
});

/**
 * @route   GET /api/analytics/trials-by-year
 * @desc    Get trials filtered by start year (Bonus feature)
 * @query   year - Minimum start year
 */
exports.getTrialsByYear = asyncHandler(async (req, res) => {
  const year = parseInt(req.query.year);

  // Validate year
  if (
    year &&
    (isNaN(year) || year < 1900 || year > new Date().getFullYear() + 10)
  ) {
    return ApiResponse.error(
      res,
      "Invalid year parameter",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const data = await analyticsService.getTrialsByYear(year);

  // Set cache headers
  res.set("Cache-Control", `public, max-age=${CACHE_DURATION.SHORT}`);

  ApiResponse.success(res, data, "Trials by year retrieved successfully");
});

/**
 * @route   GET /api/analytics/search
 * @desc    Search trials by facility name (Bonus feature)
 * @query   q - Search query
 * @query   limit - Maximum results (default: 20)
 */
exports.searchByFacility = asyncHandler(async (req, res) => {
  const searchTerm = req.query.q;
  const limit = parseInt(req.query.limit) || 20;

  if (!searchTerm || searchTerm.trim().length === 0) {
    return ApiResponse.error(
      res,
      "Search query is required",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  if (limit < 1 || limit > 100) {
    return ApiResponse.error(
      res,
      "Limit must be between 1 and 100",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  const data = await analyticsService.searchByFacility(searchTerm, limit);

  ApiResponse.success(res, data, "Search results retrieved successfully");
});
