const ClinicalTrial = require("../models/ClinicalTrial");
const { AGE_RANGES } = require("../config/constants");

class AnalyticsService {
  async getLocationDistribution() {
    const pipeline = [
      { $unwind: "$locations" },

      // Group by country and count facilities
      {
        $group: {
          _id: "$locations.country",
          count: { $sum: 1 },
        },
      },

      // Sort by count in descending order
      { $sort: { count: -1 } },

      {
        $project: {
          _id: 0,
          country: "$_id",
          count: 1,
        },
      },
    ];

    return await ClinicalTrial.aggregate(pipeline);
  }

  async getDemographics() {
    const sexDistribution = await this.getSexDistribution();

    const ageDistribution = await this.getAgeDistribution();

    return {
      sexDistribution,
      ageDistribution,
      totalTrials: await ClinicalTrial.countDocuments(),
    };
  }

  async getSexDistribution() {
    const pipeline = [
      {
        $group: {
          _id: "$sex",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          sex: "$_id",
          count: 1,
          percentage: {
            $multiply: [
              {
                $divide: [
                  "$count",
                  { $literal: await ClinicalTrial.countDocuments() },
                ],
              },
              100,
            ],
          },
        },
      },
      { $sort: { count: -1 } },
    ];

    return await ClinicalTrial.aggregate(pipeline);
  }

  async getAgeDistribution() {
    const ageDistribution = [];

    for (const range of AGE_RANGES) {
      const count = await ClinicalTrial.countDocuments({
        minimumAge: { $lte: range.max },
        maximumAge: { $gte: range.min },
      });

      ageDistribution.push({
        ageRange: range.label,
        count,
        minAge: range.min,
        maxAge: range.max,
      });
    }

    return ageDistribution;
  }

  async getTrialsPerCity(limit = 10) {
    const pipeline = [
      { $unwind: "$locations" },

      {
        $group: {
          _id: {
            city: "$locations.city",
            country: "$locations.country",
          },
          count: { $sum: 1 },
          facilities: { $addToSet: "$locations.facility" },
        },
      },

      {
        $project: {
          _id: 0,
          city: "$_id.city",
          country: "$_id.country",
          trialCount: "$count",
          facilityCount: { $size: "$facilities" },
        },
      },

      // Sort by trial count descending
      { $sort: { trialCount: -1 } },

      { $limit: limit },
    ];

    return await ClinicalTrial.aggregate(pipeline);
  }

  async getOfficials(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const pipeline = [
      // Unwind officials array
      { $unwind: "$overallOfficials" },

      // Group by official name to avoid duplicates
      {
        $group: {
          _id: "$overallOfficials.name",
          affiliations: { $addToSet: "$overallOfficials.affiliation" },
          roles: { $addToSet: "$overallOfficials.role" },
          trialCount: { $sum: 1 },
        },
      },

      // Project to clean format
      {
        $project: {
          _id: 0,
          name: "$_id",
          affiliations: {
            $filter: {
              input: "$affiliations",
              as: "aff",
              cond: { $ne: ["$$aff", null] },
            },
          },
          roles: {
            $filter: {
              input: "$roles",
              as: "role",
              cond: { $ne: ["$$role", null] },
            },
          },
          trialCount: 1,
        },
      },

      // Sort by trial count
      { $sort: { trialCount: -1 } },
    ];

    // Get total count for pagination
    const totalPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await ClinicalTrial.aggregate(totalPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Get paginated results
    const dataPipeline = [...pipeline, { $skip: skip }, { $limit: limit }];
    const data = await ClinicalTrial.aggregate(dataPipeline);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  }

  async getTrialsByYear(year) {
    const query = year ? { startYear: { $gte: year } } : {};

    const totalTrials = await ClinicalTrial.countDocuments(query);
    const trials = await ClinicalTrial.find(query)
      .select("locations sex minimumAge maximumAge startYear")
      .lean();

    return {
      totalTrials,
      year,
      trials,
    };
  }

  async getSummaryStats() {
    const [totalTrials, totalCountries, totalCities, totalFacilities] =
      await Promise.all([
        ClinicalTrial.countDocuments(),
        ClinicalTrial.distinct("locations.country").then((c) => c.length),
        ClinicalTrial.distinct("locations.city").then((c) => c.length),
        ClinicalTrial.aggregate([
          { $unwind: "$locations" },
          { $group: { _id: "$locations.facility" } },
          { $count: "total" },
        ]).then((result) => result[0]?.total || 0),
      ]);

    return {
      totalTrials,
      totalCountries,
      totalCities,
      totalFacilities,
    };
  }

  async searchByFacility(searchTerm, limit = 20) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }

    const trials = await ClinicalTrial.find(
      { $text: { $search: searchTerm } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit)
      .select("locations sex minimumAge maximumAge")
      .lean();

    return trials;
  }
}

module.exports = new AnalyticsService();
