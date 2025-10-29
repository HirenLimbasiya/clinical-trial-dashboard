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
  },
});

// Export actions
export const { clearErrors } = analyticsSlice.actions;

// Export selectors for easy state access
export const selectLocations = (state) => state.analytics.locations;
export const selectDemographics = (state) => state.analytics.demographics;
export const selectTrialsPerCity = (state) => state.analytics.trialsPerCity;
export const selectSummary = (state) => state.analytics.summary;

// Export reducer
export default analyticsSlice.reducer;
