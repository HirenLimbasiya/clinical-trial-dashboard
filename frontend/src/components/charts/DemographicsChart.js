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

// Colors for charts
const COLORS = {
  MALE: "#3b82f6",
  FEMALE: "#ec4899",
  ALL: "#10b981",
};

const DemographicsChart = ({ data, chartType = "both" }) => {
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

  // Show only pie chart
  if (chartType === "pie") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={sexDistribution}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={110}
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
    );
  }

  // Show only bar chart
  if (chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={ageDistribution}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="ageRange"
            tick={{ fill: "#64748b", fontSize: 12 }}
            stroke="#cbd5e1"
          />
          <YAxis
            label={{
              value: "Number of Trials",
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
            formatter={(value) => [`${value} trials`, "Count"]}
          />
          <Legend />
          <Bar
            dataKey="count"
            fill="#3b82f6"
            name="Trials"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }
};

export default DemographicsChart;
