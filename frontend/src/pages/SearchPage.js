/**
 * Search Page
 * Professional search interface with clean design
 */

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, X, MapPin, Users, Calendar } from "lucide-react";
import {
  searchFacilities,
  clearSearch,
  selectSearch,
} from "../redux/slices/analyticsSlice";
import Loader from "../components/common/Loader";
import "../styles/SearchPage.css";

const SearchPage = () => {
  const dispatch = useDispatch();
  const {
    data: results,
    loading,
    query: currentQuery,
  } = useSelector(selectSearch);
  const [query, setQuery] = useState(currentQuery || "");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      dispatch(searchFacilities({ query: query.trim(), limit: 20 }));
    }
  };

  const handleClear = () => {
    setQuery("");
    dispatch(clearSearch());
  };

  const popularSearches = [
    "Hospital",
    "Research Center",
    "University",
    "Medical Center",
    "Institute",
  ];

  return (
    <div className="search-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Search Clinical Trials</h1>
          <p className="page-subtitle">Find clinical trials by facility name</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-input-group">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by facility name (e.g., Hospital, Research Center)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
            {query && (
              <button
                type="button"
                className="clear-button"
                onClick={handleClear}
                disabled={loading}
              >
                <X size={18} />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="search-button"
            disabled={loading || query.trim().length < 2}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {query.trim().length > 0 && query.trim().length < 2 && (
          <p className="search-hint">Please enter at least 2 characters</p>
        )}

        {/* Popular Searches */}
        {!currentQuery && (
          <div className="popular-searches">
            <p className="popular-label">Popular searches:</p>
            <div className="search-chips">
              {popularSearches.map((term) => (
                <button
                  key={term}
                  className="search-chip"
                  onClick={() => {
                    setQuery(term);
                    dispatch(searchFacilities({ query: term, limit: 20 }));
                  }}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {currentQuery && (
        <div className="results-section">
          <div className="results-header">
            <h2 className="results-title">
              Search results for "{currentQuery}"
            </h2>
            {results && results.length > 0 && (
              <span className="results-count">{results.length} results</span>
            )}
          </div>

          {loading ? (
            <div className="results-loading">
              <Loader message="Searching clinical trials..." />
            </div>
          ) : results && results.length > 0 ? (
            <div className="results-grid">
              {results.map((trial, index) => (
                <div key={index} className="result-card">
                  <div className="card-header">
                    <span className="trial-badge">Trial #{index + 1}</span>
                    <div className="eligibility-info">
                      <span className="info-tag">
                        <Users size={14} />
                        {trial.sex}
                      </span>
                      <span className="info-tag">
                        <Calendar size={14} />
                        {trial.minimumAge}-{trial.maximumAge} years
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    <h3 className="locations-title">
                      <MapPin size={18} />
                      Locations ({trial.locations?.length || 0})
                    </h3>

                    {trial.locations && trial.locations.length > 0 ? (
                      <div className="locations-list">
                        {trial.locations.slice(0, 3).map((loc, i) => (
                          <div key={i} className="location-item">
                            <p className="facility-name">{loc.facility}</p>
                            <p className="location-address">
                              {[loc.city, loc.state, loc.country]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          </div>
                        ))}
                        {trial.locations.length > 3 && (
                          <p className="more-locations">
                            +{trial.locations.length - 3} more locations
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="no-locations">No locations available</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <Search className="no-results-icon" size={48} />
              <h3>No results found</h3>
              <p>We couldn't find any facilities matching "{currentQuery}"</p>
              <div className="search-tips">
                <p className="tips-title">Try:</p>
                <ul>
                  <li>Using different keywords</li>
                  <li>Checking your spelling</li>
                  <li>Using more general terms</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
