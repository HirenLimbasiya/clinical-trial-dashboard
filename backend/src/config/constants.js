/**
 * Application Constants
 * Defines constant values used throughout the application
 */

module.exports = {
  // Sex categories for demographics
  SEX_CATEGORIES: {
    MALE: "MALE",
    FEMALE: "FEMALE",
    ALL: "ALL",
  },

  // Age ranges for demographics grouping
  AGE_RANGES: [
    { label: "18-30", min: 18, max: 30 },
    { label: "31-45", min: 31, max: 45 },
    { label: "46-60", min: 46, max: 60 },
    { label: "61-75", min: 61, max: 75 },
    { label: "76+", min: 76, max: 150 },
  ],

  // Default pagination limits
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,

  // HTTP Status Codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  // Cache durations (in seconds)
  CACHE_DURATION: {
    SHORT: 300, // 5 minutes
    MEDIUM: 1800, // 30 minutes
    LONG: 3600, // 1 hour
  },
};
