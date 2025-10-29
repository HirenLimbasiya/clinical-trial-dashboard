/**
 * Dashboard Component
 * Main dashboard that orchestrates all charts and data fetching
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLocationDistribution,
  fetchDemographics,
  fetchTrialsPerCity,
  fetchSummaryStats,
  selectLocations,
  selectDemographics,
  selectTrialsPerCity,
  selectSummary,
} from "../redux/slices/analyticsSlice";

// Import components
import Header from "./common/Header";
import StatsCard from "./common/StatsCard";
import ChartContainer from "./charts/ChartContainer";
import LocationChart from "./charts/LocationChart";
import DemographicsChart from "./charts/DemographicsChart";
import TrialsPerCityChart from "./charts/TrialsPerCityChart";

// Import styles
import "../styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Select data from Redux store
  const locations = useSelector(selectLocations);
  const demographics = useSelector(selectDemographics);
  const trialsPerCity = useSelector(selectTrialsPerCity);
  const summary = useSelector(selectSummary);

  // Fetch all data on component mount
  useEffect(() => {
    dispatch(fetchLocationDistribution());
    dispatch(fetchDemographics());
    dispatch(fetchTrialsPerCity(10)); // Top 10 cities
    dispatch(fetchSummaryStats());
  }, [dispatch]);

  // Retry handlers for individual charts
  const handleRetryLocations = () => {
    dispatch(fetchLocationDistribution());
  };

  const handleRetryDemographics = () => {
    dispatch(fetchDemographics());
  };

  const handleRetryTrialsPerCity = () => {
    dispatch(fetchTrialsPerCity(10));
  };

  return (
    <div className="dashboard">
      <Header />

      {/* Summary Statistics Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Total Trials"
          value={summary.data?.totalTrials}
          icon="🔬"
          color="#2563eb"
          loading={summary.loading}
        />
        <StatsCard
          title="Countries"
          value={summary.data?.totalCountries}
          icon="🌍"
          color="#10b981"
          loading={summary.loading}
        />
        <StatsCard
          title="Cities"
          value={summary.data?.totalCities}
          icon="🏙️"
          color="#f59e0b"
          loading={summary.loading}
        />
        <StatsCard
          title="Facilities"
          value={summary.data?.totalFacilities}
          icon="🏥"
          color="#ec4899"
          loading={summary.loading}
        />
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Location Distribution Chart */}
        <ChartContainer
          title="Trial Facilities by Country"
          loading={locations.loading}
          error={locations.error}
          onRetry={handleRetryLocations}
        >
          <LocationChart data={locations.data} />
        </ChartContainer>

        {/* Demographics Chart */}
        <ChartContainer
          title="Participant Demographics"
          loading={demographics.loading}
          error={demographics.error}
          onRetry={handleRetryDemographics}
        >
          <DemographicsChart data={demographics.data} />
        </ChartContainer>

        {/* Trials Per City Chart */}
        <ChartContainer
          title="Top 10 Cities by Number of Trials"
          loading={trialsPerCity.loading}
          error={trialsPerCity.error}
          onRetry={handleRetryTrialsPerCity}
        >
          <TrialsPerCityChart data={trialsPerCity.data} />
        </ChartContainer>
      </div>
    </div>
  );
};

export default Dashboard;
