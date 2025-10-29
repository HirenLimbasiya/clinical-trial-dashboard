/**
 * Trials Per City Chart Component
 * Bar chart displaying top cities with most clinical trials
 */

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const TrialsPerCityChart = ({ data }) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return <div className="no-data">No city data available</div>;
  }

  // Format data for better display - combine city and country
  const chartData = data.map((item) => ({
    ...item,
    cityCountry: `${item.city}, ${item.country}`,
  }));

  // Custom tooltip to show more information
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: "0 0 5px 0", fontWeight: "bold" }}>
            {data.city}, {data.country}
          </p>
          <p style={{ margin: "0", color: "#2563eb" }}>
            Trials: {data.trialCount}
          </p>
          <p style={{ margin: "0", color: "#10b981" }}>
            Facilities: {data.facilityCount}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="cityCountry"
          angle={-45}
          textAnchor="end"
          height={120}
          interval={0}
          style={{ fontSize: "11px" }}
        />
        <YAxis
          label={{
            value: "Number of Trials",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar
          dataKey="trialCount"
          fill="#10b981"
          name="Trials"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TrialsPerCityChart;
