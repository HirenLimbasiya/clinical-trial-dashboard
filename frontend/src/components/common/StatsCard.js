import React from "react";

const StatsCard = ({ title, value, icon: Icon, loading }) => {
  return (
    <div className="stats-card">
      <div className="stats-icon-wrapper">
        <Icon size={20} strokeWidth={2} />
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
