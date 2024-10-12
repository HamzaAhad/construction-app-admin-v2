import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Router, useRouter } from "next/router";
import dayjs from "dayjs";
import { Box, Skeleton } from "@mui/material";
import ReusableChart from "./Charts";
import StatRow from "./StatRow";
import CircleData from "./CircleData";
import IssuesOverview from "./IssuesOverview";
import apiClient from "@/helpers/interceptor";
import TabButton from "./TabButton";
const MapImplementation = dynamic(() => import("../base/MapImplementation"), {
  ssr: false, // This disables server-side rendering for this component
});

const barData = {
  labels: ["1st August", "8th August", "15 August", "22 August", "29 August"], // Labels for the x-axis
  datasets: [
    {
      label: "Issues Reported",
      data: [75, 85, 70, 90, 65], // Data for the second set of bars
      backgroundColor: "#0172B2B2", // Color for the first set of bars
      borderColor: "#0172B2B2", // Border color for the first set of bars
      borderWidth: 1,
    },
    {
      label: "Issues Resolved",
      data: [65, 59, 80, 81, 56], // Data for the first set of bars
      backgroundColor: "rgba(217, 217, 217, 0.52)", // Color for the second set of bars
      borderColor: "rgba(217, 217, 217, 0.52)", // Border color for the second set of bars
      borderWidth: 1,
    },
  ],
};
const data = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Issues Reported By Month",
      data: [345, 259, 480, 120, 356, 555, 440, 123, 456, 345, 389, 529],
      // data: [100, 500, 200, 400, 200, 500, 150, 100, 300, 400, 300, 200],
      fill: true, // Fill area under the line
      backgroundColor: "rgba(217, 217, 217, 0.52)",
      borderColor: "#0172B2B2",
      tension: 0.01, // Curve smoothness
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Issues (in units)",
        color: "#0172B2B2",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      ticks: {
        // Configure tick labels
        stepSize: 100, // Interval between ticks
        callback: function (value) {
          return value; // Custom format, or use a function for more complex formatting
        },
        color: "#0172B2B2", // Label color
        font: {
          size: 14, // Font size
        },
      },
    },
    x: {
      title: {
        display: true,
        text: "Months of the Year",
        color: "#0172B2B2",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
  },
  height: "300px",
  width: "100%",
};

const pieChartData = {
  labels: ["High Priority", "Moderate Priority", "Low Priority"],
  datasets: [
    {
      label: "Issue Priorities",
      data: [32, 41, 27], // These values represent the number or percentage of issues in each category
      backgroundColor: [
        "rgba(255, 0, 0, 0.6)", // High Priority Issues - Bright red
        "rgba(200, 0, 0, 0.6)", // Moderate Priority Issues - Slightly darker red
        "rgba(150, 0, 0, 0.6)", // Low Priority Issues - Darker red
      ],
      borderColor: [
        "rgba(255, 0, 0, 1)",
        "rgba(200, 0, 0, 1)",
        "rgba(150, 0, 0, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

const Dashboard = ({ scopes }) => {
  const [bar, setBar] = useState(null);
  const [pie, setPie] = useState(null);

  const [activeCategory, setActiveCategory] = useState("site");
  const router = useRouter();
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    height: "400px",
    width: "100%",
    onClick: (event, elements) => handleBarChart(event, elements, bar),
  };
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    height: "400px",
    width: "100%",
    onClick: (event, elements) => handleChartClick(event, elements, pie),
  };

  const getLast4WeeksData = async () => {
    try {
      const response = await apiClient.get("/analytics/bar-chart");
      console.log(response.data.result);
      const { labels, reportedIssues, resolvedIssues } = response.data.result;
      setBar({
        labels: labels,
        datasets: [
          {
            label: "Inspections Reported",
            data: reportedIssues,
            backgroundColor: "#0172B2B2", // Color for the first set of bars
            borderColor: "#0172B2B2", // Border color for the first set of bars
            borderWidth: 1,
          },
          {
            label: "Inspections Resolved",
            data: resolvedIssues,
            backgroundColor: "rgba(217, 217, 217, 0.52)", // Color for the second set of bars
            borderColor: "rgba(217, 217, 217, 0.52)", // Border color for the second set of bars
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching last 4 weeks data:", error);
    }
  };
  const getPieChartData = async () => {
    try {
      const response = await apiClient.get("/analytics/pie-chart");
      console.log(response.data.result);
      const { labels, data } = response.data.result;
      setPie({
        labels: labels,
        datasets: [
          {
            label: "Inspection Priorities",
            data: data, // These values represent the number or percentage of issues in each category
            backgroundColor: [
              "rgba(255, 0, 0, 0.6)", // High Priority Issues - Bright red
              "rgba(200, 0, 0, 0.6)", // Moderate Priority Issues - Slightly darker red
              "rgba(150, 0, 0, 0.6)", // Low Priority Issues - Darker red
            ],
            borderColor: [
              "rgba(255, 0, 0, 1)",
              "rgba(200, 0, 0, 1)",
              "rgba(150, 0, 0, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching last 4 weeks data:", error);
    }
  };
  const handleBarChart = (event, elements, data) => {
    if (elements.length > 0) {
      const clickedElement = elements[0];
      const datasetIndex = clickedElement.datasetIndex; // Get the dataset index (0 or 1)
      const dataIndex = clickedElement.index; // Get the index of the clicked bar

      const clickedDatasetLabel = data.datasets[datasetIndex].label; // "Issues Reported" or "Issues Resolved"
      let clickedLabel = data.labels[dataIndex]; // Label like "1st September"

      // Remove the ordinal suffix from the clickedLabel (e.g., "1st" -> "1", "2nd" -> "2", etc.)
      clickedLabel = clickedLabel.replace(/(\d+)(st|nd|rd|th)/, "$1");

      // Parse the clickedLabel into a Day.js date object (assuming the label format is "1st September")
      const parsedDate = dayjs(
        `${clickedLabel} ${dayjs().year()}`,
        "D MMMM YYYY"
      );
      const numericDate = parsedDate.format("YYYY-MM-DD"); // Convert to 'YYYY-MM-DD' format

      // Process the clickedDatasetLabel to determine the state
      const state = clickedDatasetLabel.includes("Resolved")
        ? "close"
        : "active";
      router.push({
        pathname: `/issues`,
        query: {
          state: state,
          range: numericDate,
        },
      });
    }
  };
  const handleChartClick = (event, elements, data) => {
    if (elements.length > 0) {
      const clickedElementIndex = elements[0].index; // Get index of the clicked section
      console.log("element", elements);
      const clickedLabel = data.labels[clickedElementIndex]; // Get label of the clicked section
      console.log("onCLick", clickedElementIndex, clickedLabel);
      router.push({
        pathname: `/issues`,
        query: {
          priority: clickedLabel,
        },
      });
    }
  };

  useEffect(() => {
    getLast4WeeksData();
    getPieChartData();
  }, []);

  return (
    <div className="lg:p-4">
      <div className="flex flex-col gap-8">
        <StatRow />
        <div className="lg:px-4">
          <div className="flex flex-col lg:flex-row justify-between mx-2 gap-6">
            <div className="flex w-full lg:w-1/2 h-[350px] bg-white rounded-lg shadow transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              {bar ? (
                <ReusableChart type="bar" data={bar} options={barOptions} />
              ) : null}
            </div>
            <div className="flex w-full lg:w-1/2 h-[350px] bg-white rounded-lg shadow transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
              {pie ? (
                <ReusableChart type="pie" data={pie} options={pieOptions} />
              ) : null}
            </div>
          </div>
          <div className="flex flex-col w-[98%] p-2 mb-4 mt-6 rounded-lg bg-white mx-2 shadow transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
            {/* <ReusableChart type="area" data={data} options={options} /> */}
            <div className="flex border-b border-gray-200 mb-2">
              <TabButton
                label="Sites"
                isActive={activeCategory === "site"}
                onClick={() => setActiveCategory("site")}
              />
              <TabButton
                label="Inspections"
                isActive={activeCategory === "inspection"}
                onClick={() => setActiveCategory("inspection")}
              />
              <TabButton
                label="Events"
                isActive={activeCategory === "event"}
                onClick={() => setActiveCategory("event")}
              />
            </div>

            <MapImplementation activeCategory={activeCategory} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
