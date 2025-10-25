import { ClinicalTrial } from "../models/ClinicalTrial.js";

// 1. Facilities per country
export const getLocations = async (req, res) => {
  try {
    const data = await ClinicalTrial.aggregate([
      { $group: { _id: "$country", totalFacilities: { $sum: 1 } } },
      { $sort: { totalFacilities: -1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Participant demographics
export const getDemographics = async (req, res) => {
  try {
    const data = await ClinicalTrial.aggregate([
      {
        $group: {
          _id: "$sex",
          count: { $sum: 1 },
          avgMinAge: { $avg: "$minimumAge" },
          avgMaxAge: { $avg: "$maximumAge" },
        },
      },
      { $sort: { count: -1 } },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Top 10 cities
export const getTrialsPerCity = async (req, res) => {
  try {
    const data = await ClinicalTrial.aggregate([
      { $group: { _id: "$city", totalTrials: { $sum: 1 } } },
      { $sort: { totalTrials: -1 } },
      { $limit: 10 },
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
