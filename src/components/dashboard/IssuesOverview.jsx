import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ProgressBar from "./ProgressBar";
import apiClient from "@/helpers/interceptor";

const ProgressSection = ({ label, value, percentage, color }) => {
  const router = useRouter();
  const handleClick = () => {
    if (label === "Total Inspections") {
      router.push({
        pathname: `/issues`,
        query: {
          status: "all",
        },
      });
    } else {
      const val = label.split(" ")[0];
      const tag =
        val === "Pending" ? "pending" : val === "Resolved" ? "close" : "active";
      router.push({
        pathname: `/issues`,
        query: {
          status: tag,
        },
      });
    }
  };
  return (
    <div className="mb-4 cursor-pointer" onClick={handleClick}>
      <p className="text-[15px] text-black font-semibold animate-pulse">
        {label}: {value}
      </p>
      <ProgressBar percentage={percentage} color={color} />
      <p className="text-sm text-gray-600 mt-1">{percentage.toFixed(2)}%</p>
    </div>
  );
};

const IssuesOverview = () => {
  const [issues, setIssues] = useState({
    total: 0,
    pending: 0,
    close: 0,
    open: 0,
  });
  const [percentage, setPercentage] = useState({
    pending: 0,
    open: 0,
    close: 0,
  });
  const fetchCount = async () => {
    try {
      // setLoading(true);
      const response = await apiClient.get(`/analytics/issues-analytics`);
      console.log(response.data.result);
      setIssues({
        total: response.data.result.totalIssues,
        pending: response.data.result.pendingIssues,
        open: response.data.result.openIssues,
        close: response.data.result.closedIssues,
      });
      if (response.data.result.totalIssues > 0) {
        const reportedPercentage =
          (response.data.result.pendingIssues /
            response.data.result.totalIssues) *
          100;
        const resolvedPercentage =
          (response.data.result.closedIssues /
            response.data.result.totalIssues) *
          100;
        const workingOnPercentage =
          (response.data.result.openIssues / response.data.result.totalIssues) *
          100;

        setPercentage({
          pending: reportedPercentage,
          open: workingOnPercentage,
          close: resolvedPercentage,
        });
      }
    } catch (err) {
      console.log(err);
    }
    // setLoading(false);
  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <div className="py-4 px-6 h-[363px] bg-white shadow rounded-lg animate-slideBottom transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <h3 className="text-lg  text-buttonColorPrimary font-semibold mb-4">
        Inspections Overview
      </h3>
      <ProgressSection
        label="Total Inspections"
        value={issues.total}
        percentage={issues.total > 0 ? 100 : 0}
        color="bg-gradient-inspection"
      />

      <ProgressSection
        label="Pending Inspections"
        value={issues.pending}
        percentage={percentage.pending}
        color="bg-gradient-reported"
      />

      <ProgressSection
        label="Resolved Inspections"
        value={issues.close}
        percentage={percentage.close}
        color="bg-gradient-resolved"
      />

      <ProgressSection
        label="Open Inspections"
        value={issues.open}
        percentage={percentage.open}
        color="bg-gradient-workingOn"
      />
    </div>
  );
};

export default IssuesOverview;
