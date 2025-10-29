/**
 * Analytics Service
 * Business logic for data aggregation and analytics processing
 * All MongoDB aggregation queries are optimized with proper indexing
 */

const ClinicalTrial = require("../models/ClinicalTrial");
const { AGE_RANGES } = require("../config/constants");

class AnalyticsService {
  /**
   * Get distribution of clinical trial facilities by country
   * Uses MongoDB aggregation with $unwind and $group for efficiency
   * @returns {Promise<Array>} Array of countries with facility counts
   */
  async getLocationDistribution() {
    const pipeline = [
      // Unwind locations array to create separate documents for each location
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

      // Project to rename _id to country
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

  /**
   * Get participant demographics (sex and age distribution)
   * Optimized with compound index on sex, minimumAge, maximumAge
   * @returns {Promise<Object>} Demographics data including sex and age distributions
   */
  async getDemographics() {
    // Get sex distribution
    const sexDistribution = await this.getSexDistribution();

    // Get age distribution
    const ageDistribution = await this.getAgeDistribution();

    return {
      sexDistribution,
      ageDistribution,
      totalTrials: await ClinicalTrial.countDocuments(),
    };
  }

  /**
   * Get sex distribution across all trials
   * @returns {Promise<Array>} Array of sex categories with counts
   */
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

  /**
   * Get age distribution grouped by predefined age ranges
   * @returns {Promise<Array>} Array of age ranges with counts
   */
  async getAgeDistribution() {
    const ageDistribution = [];

    // Query each age range
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

  /**
   * Get number of trials per city
   * Returns top N cities with most trials (default: 10)
   * Optimized with index on locations.city
   * @param {number} limit - Number of top cities to return
   * @returns {Promise<Array>} Array of cities with trial counts
   */
  async getTrialsPerCity(limit = 10) {
    const pipeline = [
      // Unwind locations array
      { $unwind: "$locations" },

      // Group by city and country (city names may repeat across countries)
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

      // Add facility count
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

      // Limit to top N cities
      { $limit: limit },
    ];

    return await ClinicalTrial.aggregate(pipeline);
  }

  /**
   * Get overall officials with their affiliations
   * Supports pagination for large datasets
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Items per page (default: 10)
   * @returns {Promise<Object>} Paginated officials data
   */
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

  /**
   * Get trials filtered by start year (Bonus feature)
   * @param {number} year - Minimum start year
   * @returns {Promise<Object>} Analytics data for filtered trials
   */
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

  /**
   * Get summary statistics for dashboard
   * @returns {Promise<Object>} Summary statistics
   */
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

  /**
   * Search trials by facility name (Bonus feature)
   * Uses text index for efficient searching
   * @param {string} searchTerm - Search term for facility name
   * @param {number} limit - Maximum results to return
   * @returns {Promise<Array>} Matching trials
   */
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
