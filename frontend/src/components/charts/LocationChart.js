/**
 * Location Chart Component
 * Bar chart displaying number of clinical trial facilities per country
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

const LocationChart = ({ data }) => {
  // Handle empty data
  if (!data || data.length === 0) {
    return <div className="no-data">No location data available</div>;
  }

  // Take top 15 countries for better visualization
  const chartData = data.slice(0, 15);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="country"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          label={{
            value: "Number of Facilities",
            angle: -90,
            position: "insideLeft",
          }}
        />
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
          formatter={(value) => [`${value} facilities`, "Count"]}
        />
        <Legend />
        <Bar
          dataKey="count"
          fill="#2563eb"
          name="Facilities"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LocationChart;
