import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const LocationChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="no-data">No location data available</div>;
  }

  const chartData = data.slice(0, 15);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#e2e8f0"
          vertical={false}
        />
        <XAxis
          dataKey="country"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fill: "#64748b", fontSize: 12 }}
          stroke="#cbd5e1"
        />
        <YAxis
          label={{
            value: "Number of Facilities",
            angle: -90,
            position: "insideLeft",
            style: { fill: "#64748b", fontSize: 12 },
          }}
          tick={{ fill: "#64748b", fontSize: 12 }}
          stroke="#cbd5e1"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          }}
          cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
          formatter={(value) => [`${value} facilities`, "Count"]}
        />
        <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LocationChart;
