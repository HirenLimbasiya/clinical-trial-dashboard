/**
 * Stats Card Component
 * Displays a single statistic with icon, title, and value
 */

import React from "react";

const StatsCard = ({ title, value, icon, color = "#2563eb", loading }) => {
  return (
    <div className="stats-card">
      <div
        className="stats-icon"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
      </div>
      <div className="stats-content">
        <p className="stats-title">{title}</p>
        {loading ? (
          <div className="stats-skeleton"></div>
        ) : (
          <p className="stats-value">{value?.toLocaleString() || 0}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
