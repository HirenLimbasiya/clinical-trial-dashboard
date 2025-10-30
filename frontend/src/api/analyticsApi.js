/**
 * Analytics API Service
 * Handles all API calls to the backend
 */

import axios from "axios";

// Base URL from environment variable
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.data);
      throw new Error(
        error.response.data.error?.message || "Server error occurred"
      );
    } else if (error.request) {
      // Request made but no response
      console.error("Network Error:", error.request);
      throw new Error("Network error. Please check your connection.");
    } else {
      // Something else happened
      console.error("Error:", error.message);
      throw new Error("An unexpected error occurred");
    }
  }
);

/**
 * Analytics API Methods
 */
const analyticsApi = {
  /**
   * Get location distribution (facilities per country)
   * @returns {Promise} Location distribution data
   */
  getLocationDistribution: async () => {
    const response = await apiClient.get("/analytics/locations");
    return response.data;
  },

  /**
   * Get demographics (sex and age distribution)
   * @returns {Promise} Demographics data
   */
  getDemographics: async () => {
    const response = await apiClient.get("/analytics/demographics");
    return response.data;
  },

  /**
   * Get trials per city
   * @param {number} limit - Number of top cities to fetch (default: 10)
   * @returns {Promise} Trials per city data
   */
  getTrialsPerCity: async (limit = 10) => {
    const response = await apiClient.get("/analytics/trials-per-city", {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get summary statistics
   * @returns {Promise} Summary statistics
   */
  getSummaryStats: async () => {
    const response = await apiClient.get("/analytics/summary");
    return response.data;
  },

  /**
   * Get trials by year (Bonus feature)
   * @param {number} year - Minimum start year
   * @returns {Promise} Filtered trials data
   */
  getTrialsByYear: async (year) => {
    const response = await apiClient.get("/analytics/trials-by-year", {
      params: { year },
    });
    return response.data;
  },

  /**
   * Get officials with pagination (Bonus feature)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   * @returns {Promise} Paginated officials data
   */
  getOfficials: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/analytics/officials", {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Search facilities by name (Bonus feature)
   * @param {string} query - Search query
   * @param {number} limit - Maximum results
   * @returns {Promise} Search results
   */
  searchFacilities: async (query, limit = 20) => {
    const response = await apiClient.get("/analytics/search", {
      params: { q: query, limit },
    });
    return response.data;
  },
};

export default analyticsApi;
