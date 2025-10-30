import React from "react";
import Loader from "../common/Loader";
import ErrorMessage from "../common/ErrorMessage";

const ChartContainer = ({ title, loading, error, children, onRetry }) => {
  return (
    <div className="chart-container">
      <h2 className="chart-title">{title}</h2>
      <div className="chart-content">
        {loading ? (
          <Loader />
        ) : error ? (
          <ErrorMessage message={error} onRetry={onRetry} />
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartContainer;
