import express from "express";
import {
  getLocations,
  getDemographics,
  getTrialsPerCity,
  getOfficialsPaginated,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/locations", getLocations);
router.get("/demographics", getDemographics);
router.get("/trials-per-city", getTrialsPerCity);
router.get("/officials", getOfficialsPaginated);

export default router;
