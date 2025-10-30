/**
 * Analytics Redux Slice
 * Manages state for all analytics data using Redux Toolkit
 */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import analyticsApi from "../../api/analyticsApi";

/**
 * Initial state structure
 */
const initialState = {
  locations: {
    data: [],
    loading: false,
    error: null,
  },
  demographics: {
    data: null,
    loading: false,
    error: null,
  },
  trialsPerCity: {
    data: [],
    loading: false,
    error: null,
  },
  summary: {
    data: null,
    loading: false,
    error: null,
  },
  officials: {
    data: [],
    pagination: null,
    loading: false,
    error: null,
  },
  trialsByYear: {
    data: [],
    loading: false,
    error: null,
    selectedYear: null,
  },
  search: {
    data: [],
    loading: false,
    error: null,
    query: "",
  },
};

/**
 * Async Thunks - Handle API calls with loading/error states automatically
 */

// Fetch location distribution
export const fetchLocationDistribution = createAsyncThunk(
  "analytics/fetchLocationDistribution",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getLocationDistribution();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch demographics
export const fetchDemographics = createAsyncThunk(
  "analytics/fetchDemographics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getDemographics();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch trials per city
export const fetchTrialsPerCity = createAsyncThunk(
  "analytics/fetchTrialsPerCity",
  async (limit = 10, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getTrialsPerCity(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch summary statistics
export const fetchSummaryStats = createAsyncThunk(
  "analytics/fetchSummaryStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getSummaryStats();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch officials with pagination
export const fetchOfficials = createAsyncThunk(
  "analytics/fetchOfficials",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getOfficials(page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch trials by year
export const fetchTrialsByYear = createAsyncThunk(
  "analytics/fetchTrialsByYear",
  async (year, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.getTrialsByYear(year);
      return { data: response.data, year };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Search facilities
export const searchFacilities = createAsyncThunk(
  "analytics/searchFacilities",
  async ({ query, limit = 20 }, { rejectWithValue }) => {
    try {
      const response = await analyticsApi.searchFacilities(query, limit);
      return { data: response.data, query };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Analytics Slice
 * Automatically generates actions and reducers
 */
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    // Synchronous actions if needed
    clearErrors: (state) => {
      state.locations.error = null;
      state.demographics.error = null;
      state.trialsPerCity.error = null;
      state.summary.error = null;
      state.officials.error = null;
      state.trialsByYear.error = null;
      state.search.error = null;
    },
    clearSearch: (state) => {
      state.search.data = [];
      state.search.query = "";
      state.search.error = null;
    },
  },
  extraReducers: (builder) => {
    // Location Distribution
    builder
      .addCase(fetchLocationDistribution.pending, (state) => {
        state.locations.loading = true;
        state.locations.error = null;
      })
      .addCase(fetchLocationDistribution.fulfilled, (state, action) => {
        state.locations.loading = false;
        state.locations.data = action.payload;
      })
      .addCase(fetchLocationDistribution.rejected, (state, action) => {
        state.locations.loading = false;
        state.locations.error = action.payload;
      });

    // Demographics
    builder
      .addCase(fetchDemographics.pending, (state) => {
        state.demographics.loading = true;
        state.demographics.error = null;
      })
      .addCase(fetchDemographics.fulfilled, (state, action) => {
        state.demographics.loading = false;
        state.demographics.data = action.payload;
      })
      .addCase(fetchDemographics.rejected, (state, action) => {
        state.demographics.loading = false;
        state.demographics.error = action.payload;
      });

    // Trials Per City
    builder
      .addCase(fetchTrialsPerCity.pending, (state) => {
        state.trialsPerCity.loading = true;
        state.trialsPerCity.error = null;
      })
      .addCase(fetchTrialsPerCity.fulfilled, (state, action) => {
        state.trialsPerCity.loading = false;
        state.trialsPerCity.data = action.payload;
      })
      .addCase(fetchTrialsPerCity.rejected, (state, action) => {
        state.trialsPerCity.loading = false;
        state.trialsPerCity.error = action.payload;
      });

    // Summary Stats
    builder
      .addCase(fetchSummaryStats.pending, (state) => {
        state.summary.loading = true;
        state.summary.error = null;
      })
      .addCase(fetchSummaryStats.fulfilled, (state, action) => {
        state.summary.loading = false;
        state.summary.data = action.payload;
      })
      .addCase(fetchSummaryStats.rejected, (state, action) => {
        state.summary.loading = false;
        state.summary.error = action.payload;
      });

    // Officials
    builder
      .addCase(fetchOfficials.pending, (state) => {
        state.officials.loading = true;
        state.officials.error = null;
      })
      .addCase(fetchOfficials.fulfilled, (state, action) => {
        state.officials.loading = false;
        state.officials.data = action.payload.data;
        state.officials.pagination = action.payload.pagination;
      })
      .addCase(fetchOfficials.rejected, (state, action) => {
        state.officials.loading = false;
        state.officials.error = action.payload;
      });

    // Trials By Year
    builder
      .addCase(fetchTrialsByYear.pending, (state) => {
        state.trialsByYear.loading = true;
        state.trialsByYear.error = null;
      })
      .addCase(fetchTrialsByYear.fulfilled, (state, action) => {
        state.trialsByYear.loading = false;
        state.trialsByYear.data = action.payload.data;
        state.trialsByYear.selectedYear = action.payload.year;
      })
      .addCase(fetchTrialsByYear.rejected, (state, action) => {
        state.trialsByYear.loading = false;
        state.trialsByYear.error = action.payload;
      });

    // Search Facilities
    builder
      .addCase(searchFacilities.pending, (state) => {
        state.search.loading = true;
        state.search.error = null;
      })
      .addCase(searchFacilities.fulfilled, (state, action) => {
        state.search.loading = false;
        state.search.data = action.payload.data;
        state.search.query = action.payload.query;
      })
      .addCase(searchFacilities.rejected, (state, action) => {
        state.search.loading = false;
        state.search.error = action.payload;
      });
  },
});

// Export actions
export const { clearErrors, clearSearch } = analyticsSlice.actions;

// Export selectors for easy state access
export const selectLocations = (state) => state.analytics.locations;
export const selectDemographics = (state) => state.analytics.demographics;
export const selectTrialsPerCity = (state) => state.analytics.trialsPerCity;
export const selectSummary = (state) => state.analytics.summary;
export const selectOfficials = (state) => state.analytics.officials;
export const selectTrialsByYear = (state) => state.analytics.trialsByYear;
export const selectSearch = (state) => state.analytics.search;

// Export reducer
export default analyticsSlice.reducer;
