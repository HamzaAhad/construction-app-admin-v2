import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Skeleton from "@mui/material/Skeleton";

import apiClient from "@/helpers/interceptor";

// Reusable TabButton component
const TabButton = ({ label, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1 focus:outline-none ${
        isActive
          ? "border-b-2 border-blue-500 text-buttonColorPrimary"
          : "text-gray-600"
      }`}>
      {label}
    </button>
  );
};

// Reusable InfoBlock component
const InfoBlock = ({
  label,
  value,
  issues,
  tag,
  tab,
  dateParameter,
  category,
}) => {
  const router = useRouter();
  const handleClick = () => {
    if (tab === "all") {
      router.push({
        pathname: `/${category}`,
        query: {
          status: tag,
          date: JSON.stringify(dateParameter),
        },
      });
    } else {
      router.push({
        pathname: `${category}`,
        query: {
          status: tag,
          tab: tab,
        },
      });
    }
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="flex justify-between py-1 px-2 hover:bg-gray-300 cursor-pointer">
        <p className="text-sm text-black font-medium">{label}:</p>
        <p className="text-sm text-black font-semibold">{value}</p>
      </div>
      <div className="border-b border-gray-200" />
    </>
  );
};

// Main RecentActivities component
const RecentActivities = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("issues");
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateParameter, setDateParameter] = useState(null);
  const [issues, setIssues] = useState({
    total: 0,
    pending: 0,
    close: 0,
    open: 0,
  });
  const [currentIssues, setCurrentIssues] = useState([]);
  const fetchCount = async () => {
    try {
      // setLoading(true);
      const response = await apiClient.get(
        `/analytics/${activeCategory}-analytics`,
        {
          params: dateParameter
            ? dateParameter
            : {
                period: activeTab,
              },
        }
      );
      setIssues({
        total: response.data.result.totalIssues,
        pending: response.data.result.pendingIssues,
        open: response.data.result.openIssues,
        close: response.data.result.closedIssues,
      });
      setCurrentIssues(response.data.result.issues);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
    // setLoading(false);
  };

  useEffect(() => {
    fetchCount();
  }, [activeTab, dateParameter, activeCategory]);
  const handleClick = () => {
    if (fromDate !== "" && toDate !== "") {
      setDateParameter({
        from: fromDate,
        to: toDate,
      });
    }
  };
  return (
    <div className="p-4 lg:mx-4 mt-2 animate-slideInLeft bg-white shadow rounded-lg w-full lg:w-[96%] transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="flex justify-between">
        <h3 className="text-[15px] sm:text-lg text-buttonColorPrimary animate-pulse font-semibold mb-2">
          Recent Activities
        </h3>
        <div className="flex border-b border-gray-200 mb-2">
          <TabButton
            label="Inspections"
            isActive={activeCategory === "issues"}
            onClick={() => setActiveCategory("issues")}
          />
          <TabButton
            label="Events"
            isActive={activeCategory === "events"}
            onClick={() => setActiveCategory("events")}
          />
        </div>
      </div>

      <div className="flex border-b border-gray-200 mb-2">
        <TabButton
          label="All"
          isActive={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        />
        <TabButton
          label="Today"
          isActive={activeTab === "daily"}
          onClick={() => setActiveTab("daily")}
        />
        <TabButton
          label="Last Week"
          isActive={activeTab === "weekly"}
          onClick={() => setActiveTab("weekly")}
        />
        <TabButton
          label="Last Month"
          isActive={activeTab === "monthly"}
          onClick={() => setActiveTab("monthly")}
        />
      </div>

      {activeTab === "all" ? (
        <>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0   space-x-2">
            <div className="flex space-x-2">
              <label className="mt-1 text-gray-950">From</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="px-1 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex space-x-1">
              <label className="mt-1 text-gray-950">To</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="px-1 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              onClick={handleClick}
              className="px-4 bg-buttonColorPrimary rounded-[8px] text-gray-50">
              Apply Filter
            </button>
          </div>
          <div className="border-b border-gray-200 mt-2" />
        </>
      ) : null}

      <div className="mt-4">
        {loading ? (
          <div className="w-full">
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </div>
        ) : (
          <>
            <InfoBlock
              label={
                activeCategory === "issues"
                  ? "Total Inspections"
                  : "Total Events"
              }
              value={issues.total}
              tag="all"
              tab={activeTab}
              dateParameter={dateParameter}
              category={activeCategory}
              issues={currentIssues}
            />
            {activeCategory === "issues" ? (
              <InfoBlock
                label={
                  activeCategory === "issues"
                    ? "Pending Inspections"
                    : "Pending Events"
                }
                value={issues.pending}
                tag="pending"
                tab={activeTab}
                dateParameter={dateParameter}
                category={activeCategory}
                issues={currentIssues}
              />
            ) : null}
            <InfoBlock
              label={
                activeCategory === "issues"
                  ? "Resolved Inspections"
                  : "Resolved Events"
              }
              value={issues.close}
              tag="close"
              tab={activeTab}
              dateParameter={dateParameter}
              category={activeCategory}
              issues={currentIssues}
            />
            <InfoBlock
              label={
                activeCategory === "issues" ? "Open Inspections" : "Open Events"
              }
              value={issues.open}
              tag="active"
              tab={activeTab}
              dateParameter={dateParameter}
              category={activeCategory}
              issues={currentIssues}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default RecentActivities;
