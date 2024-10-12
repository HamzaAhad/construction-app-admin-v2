import React from "react";
import { Doughnut, Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

// Register elements and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler // Register Filler for area chart
);

const ReusableChart = ({ type, data, options }) => {
  const renderChart = () => {
    switch (type) {
      case "doughnut":
        return <Doughnut data={data} options={options} />;
      case "bar":
        return <Bar data={data} options={options} />;
      case "line":
        return <Line data={data} options={options} />;
      case "pie":
        return <Pie data={data} options={options} />;
      case "area":
        return <Line data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />; // Default to Bar chart
    }
  };

  return <div className="w-full rounded-lg p-10">{renderChart()}</div>;
};

export default ReusableChart;
