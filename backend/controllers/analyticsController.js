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

// Get paginated and searchable officials
export const getOfficialsPaginated = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "" } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Build a case-insensitive regex for search
    const searchRegex = new RegExp(search, "i");

    // Aggregate all officials across all trials
    const allOfficials = await ClinicalTrial.aggregate([
      { $unwind: "$overallOfficials" },
      {
        $project: {
          _id: 0,
          name: "$overallOfficials.name",
          affiliation: "$overallOfficials.affiliation",
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: searchRegex } },
            { affiliation: { $regex: searchRegex } },
          ],
        },
      },
    ]);

    const total = allOfficials.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginated = allOfficials.slice(startIndex, endIndex);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
