/**
 * Dashboard Component
 * Professional analytics dashboard with clean design
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Activity, MapPin, Users as UsersIcon, Building2 } from "lucide-react";
import {
  fetchLocationDistribution,
  fetchDemographics,
  fetchTrialsPerCity,
  fetchSummaryStats,
  fetchTrialsByYear,
  selectLocations,
  selectDemographics,
  selectTrialsPerCity,
  selectSummary,
  selectTrialsByYear,
} from "../redux/slices/analyticsSlice";

// Import components
import StatsCard from "./common/StatsCard";
import ChartContainer from "./charts/ChartContainer";
import LocationChart from "./charts/LocationChart";
import DemographicsChart from "./charts/DemographicsChart";
import TrialsPerCityChart from "./charts/TrialsPerCityChart";
import YearFilter from "./filters/YearFilter";

// Import styles
import "../styles/Dashboard.css";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Select data from Redux store
  const locations = useSelector(selectLocations);
  const demographics = useSelector(selectDemographics);
  const trialsPerCity = useSelector(selectTrialsPerCity);
  const summary = useSelector(selectSummary);
  const trialsByYear = useSelector(selectTrialsByYear);

  // Fetch all data on component mount
  useEffect(() => {
    dispatch(fetchLocationDistribution());
    dispatch(fetchDemographics());
    dispatch(fetchTrialsPerCity(10));
    dispatch(fetchSummaryStats());
  }, [dispatch]);

  // Retry handlers
  const handleRetryLocations = () => dispatch(fetchLocationDistribution());
  const handleRetryDemographics = () => dispatch(fetchDemographics());
  const handleRetryTrialsPerCity = () => dispatch(fetchTrialsPerCity(10));

  // Year filter handler
  const handleYearFilter = (year) => {
    if (year) {
      dispatch(fetchTrialsByYear(year));
    } else {
      dispatch(fetchTrialsByYear(null));
    }
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of clinical trials analytics</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          title="Total Trials"
          value={summary.data?.totalTrials}
          icon={Activity}
          loading={summary.loading}
        />
        <StatsCard
          title="Countries"
          value={summary.data?.totalCountries}
          icon={MapPin}
          loading={summary.loading}
        />
        <StatsCard
          title="Cities"
          value={summary.data?.totalCities}
          icon={Building2}
          loading={summary.loading}
        />
        <StatsCard
          title="Facilities"
          value={summary.data?.totalFacilities}
          icon={UsersIcon}
          loading={summary.loading}
        />
      </div>

      {/* Year Filter */}
      <div className="filter-section">
        <ChartContainer
          title="Filter by Year"
          loading={trialsByYear.loading}
          error={trialsByYear.error}
        >
          <YearFilter
            onFilter={handleYearFilter}
            loading={trialsByYear.loading}
            selectedYear={trialsByYear.selectedYear}
          />
          {trialsByYear.data && trialsByYear.selectedYear && (
            <div className="filter-results">
              <p className="filter-results-text">
                <strong>{trialsByYear.data.totalTrials || 0}</strong> trials
                found starting from year{" "}
                <strong>{trialsByYear.selectedYear}</strong>
              </p>
            </div>
          )}
        </ChartContainer>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <ChartContainer
          title="Facilities by Country"
          loading={locations.loading}
          error={locations.error}
          onRetry={handleRetryLocations}
        >
          <LocationChart data={locations.data} />
        </ChartContainer>

        <ChartContainer
          title="Participant Demographics"
          loading={demographics.loading}
          error={demographics.error}
          onRetry={handleRetryDemographics}
        >
          <DemographicsChart data={demographics.data} />
        </ChartContainer>

        <ChartContainer
          title="Top Cities"
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
