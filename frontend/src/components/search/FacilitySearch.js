/**
 * Facility Search Component
 * Search clinical trials by facility name
 */

import React, { useState } from "react";

const FacilitySearch = ({
  onSearch,
  results,
  loading,
  currentQuery,
  onClear,
}) => {
  const [query, setQuery] = useState(currentQuery || "");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div className="facility-search">
      <div className="search-header">
        <h3>Search Facilities</h3>
        <p className="search-description">
          Find clinical trials by facility name (minimum 2 characters)
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-group">
          <input
            type="text"
            placeholder="Enter facility name (e.g., Hospital, Research Center)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
            className="search-input"
            minLength={2}
          />
          <button
            type="submit"
            disabled={loading || query.trim().length < 2}
            className="search-btn"
          >
            {loading ? "🔍 Searching..." : "🔍 Search"}
          </button>
          {currentQuery && (
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="clear-btn"
            >
              ✕ Clear
            </button>
          )}
        </div>
      </form>

      {/* Search Results */}
      {currentQuery && (
        <div className="search-results">
          <div className="results-header">
            <h4>
              Search Results for "{currentQuery}"
              {results && ` (${results.length} found)`}
            </h4>
          </div>

          {loading ? (
            <div className="search-loading">Searching...</div>
          ) : results && results.length > 0 ? (
            <div className="results-list">
              {results.map((trial, index) => (
                <div key={index} className="result-card">
                  <div className="result-header">
                    <h5>Trial #{index + 1}</h5>
                    <span className="eligibility-badge">
                      {trial.sex} • Ages {trial.minimumAge}-{trial.maximumAge}
                    </span>
                  </div>
                  <div className="result-locations">
                    <strong>Locations:</strong>
                    {trial.locations && trial.locations.length > 0 ? (
                      <ul className="location-list">
                        {trial.locations.slice(0, 3).map((loc, i) => (
                          <li key={i}>
                            📍 {loc.facility}
                            {loc.city && `, ${loc.city}`}
                            {loc.country && `, ${loc.country}`}
                          </li>
                        ))}
                        {trial.locations.length > 3 && (
                          <li className="more-locations">
                            ... and {trial.locations.length - 3} more
                          </li>
                        )}
                      </ul>
                    ) : (
                      <span>No locations available</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <p>No facilities found matching "{currentQuery}"</p>
              <p className="search-tip">
                Try using different keywords or check spelling
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FacilitySearch;
