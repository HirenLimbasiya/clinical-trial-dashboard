
require("dotenv").config();

// Validate required environment variables
const requiredEnvVars = ["MONGODB_URI"];

requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});

module.exports = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,

  // Database Configuration
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_POOL_SIZE: parseInt(process.env.MONGODB_POOL_SIZE, 10) || 10,

  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS:
    parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS:
    parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
};
