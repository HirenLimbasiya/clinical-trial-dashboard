/**
 * Demographics Chart Component
 * Displays sex distribution (Pie Chart) and age distribution (Bar Chart)
 */

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Colors for pie chart
const COLORS = {
  MALE: "#2563eb",
  FEMALE: "#ec4899",
  ALL: "#10b981",
};

const DemographicsChart = ({ data }) => {
  // Handle empty data
  if (!data) {
    return <div className="no-data">No demographics data available</div>;
  }

  const { sexDistribution, ageDistribution } = data;

  // Custom label for pie chart
  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        style={{ fontSize: "14px", fontWeight: "bold" }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
      {/* Sex Distribution - Pie Chart */}
      <div>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#374151",
          }}
        >
          Sex Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sexDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="count"
              nameKey="sex"
            >
              {sexDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.sex]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name, props) => [
                `${value} trials (${props.payload.percentage?.toFixed(1)}%)`,
                props.payload.sex,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Age Distribution - Bar Chart */}
      <div>
        <h3
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#374151",
          }}
        >
          Age Range Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={ageDistribution}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ageRange" />
            <YAxis
              label={{
                value: "Number of Trials",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
              }}
              formatter={(value) => [`${value} trials`, "Count"]}
            />
            <Legend />
            <Bar
              dataKey="count"
              fill="#f59e0b"
              name="Trials"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DemographicsChart;
