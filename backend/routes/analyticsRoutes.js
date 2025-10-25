import express from "express";
import {
  getLocations,
  getDemographics,
  getTrialsPerCity,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/locations", getLocations);
router.get("/demographics", getDemographics);
router.get("/trials-per-city", getTrialsPerCity);

export default router;