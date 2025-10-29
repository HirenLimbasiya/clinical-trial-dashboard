/**
 * Main Router
 * Combines all route modules
 */

const express = require("express");
const router = express.Router();
const analyticsRoutes = require("./analyticsRoutes");

// Mount analytics routes
router.use("/analytics", analyticsRoutes);

// API info endpoint
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Clinical Trial Analytics API",
    version: "1.0.0",
    endpoints: {
      analytics: {
        locations: "GET /api/analytics/locations",
        demographics: "GET /api/analytics/demographics",
        trialsPerCity: "GET /api/analytics/trials-per-city?limit=10",
        officials: "GET /api/analytics/officials?page=1&limit=10",
        summary: "GET /api/analytics/summary",
        trialsByYear: "GET /api/analytics/trials-by-year?year=2020",
        search: "GET /api/analytics/search?q=hospital&limit=20",
      },
    },
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
