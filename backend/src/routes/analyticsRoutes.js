const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.get("/locations", analyticsController.getLocationDistribution);
router.get("/demographics", analyticsController.getDemographics);
router.get("/trials-per-city", analyticsController.getTrialsPerCity);
router.get("/officials", analyticsController.getOfficials);
router.get("/summary", analyticsController.getSummaryStats);
router.get("/trials-by-year", analyticsController.getTrialsByYear);
router.get("/search", analyticsController.searchByFacility);

module.exports = router;
