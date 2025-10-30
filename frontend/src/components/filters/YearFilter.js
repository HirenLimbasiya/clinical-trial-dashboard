/**
 * Year Filter Component
 * Allows filtering trials by start year
 */

import React, { useState } from "react";

const YearFilter = ({ onFilter, loading, selectedYear }) => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(selectedYear || "");

  // Generate year options (last 10 years)
  const yearOptions = [];
  for (let i = 0; i < 10; i++) {
    yearOptions.push(currentYear - i);
  }

  const handleFilter = () => {
    if (year) {
      onFilter(parseInt(year));
    }
  };

  const handleReset = () => {
    setYear("");
    onFilter(null);
  };

  return (
    <div className="year-filter">
      <div className="filter-header">
        <h3>Filter by Start Year</h3>
        <p className="filter-description">
          Show trials starting from the selected year onwards
        </p>
      </div>

      <div className="filter-controls">
        <div className="filter-input-group">
          <label htmlFor="year-select">Select Year:</label>
          <select
            id="year-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={loading}
            className="year-select"
          >
            <option value="">All Years</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-buttons">
          <button
            onClick={handleFilter}
            disabled={!year || loading}
            className="filter-btn primary"
          >
            {loading ? "Loading..." : "Apply Filter"}
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="filter-btn secondary"
          >
            Reset
          </button>
        </div>
      </div>

      {selectedYear && (
        <div className="filter-active">
          <span className="filter-badge">
            📅 Filtered: Year {selectedYear}+
          </span>
        </div>
      )}
    </div>
  );
};

export default YearFilter;
