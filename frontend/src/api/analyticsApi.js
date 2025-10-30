import axios from "axios";

// Base URL from environment variable
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001/api";

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
    if (error.response) {
      throw new Error(
        error.response.data.error?.message || "Server error occurred"
      );
    } else if (error.request) {
      console.error("Network Error:", error.request);
      throw new Error("Network error. Please check your connection.");
    } else {
      console.error("Error:", error.message);
      throw new Error("An unexpected error occurred");
    }
  }
);

const analyticsApi = {
  getLocationDistribution: async () => {
    const response = await apiClient.get("/analytics/locations");
    return response.data;
  },

  getDemographics: async () => {
    const response = await apiClient.get("/analytics/demographics");
    return response.data;
  },

  getTrialsPerCity: async (limit = 10) => {
    const response = await apiClient.get("/analytics/trials-per-city", {
      params: { limit },
    });
    return response.data;
  },

  getSummaryStats: async () => {
    const response = await apiClient.get("/analytics/summary");
    return response.data;
  },

  getTrialsByYear: async (year) => {
    const response = await apiClient.get("/analytics/trials-by-year", {
      params: { year },
    });
    return response.data;
  },

  getOfficials: async (page = 1, limit = 10) => {
    const response = await apiClient.get("/analytics/officials", {
      params: { page, limit },
    });
    return response.data;
  },

  searchFacilities: async (query, limit = 20) => {
    const response = await apiClient.get("/analytics/search", {
      params: { q: query, limit },
    });
    return response.data;
  },
};

export default analyticsApi;
