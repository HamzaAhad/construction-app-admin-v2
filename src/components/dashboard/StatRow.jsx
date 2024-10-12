import React, { useEffect, useState } from "react";
import StatsBox from "./StatBox";
import {
  WorkOutline,
  ReportProblem,
  CheckCircleOutline,
  Person,
  People,
  Category,
} from "@mui/icons-material";
import { FaAddressBook } from "react-icons/fa";
import IssuesOverview from "./IssuesOverview";
import RecentActivities from "./RecentActivties";
import apiClient from "@/helpers/interceptor";

const StatRow = () => {
  const [counts, setCounts] = useState({
    userCounts: 0,
    categoryCount: 0,
    inspectionCount: 0,
  });
  const fetchCount = async () => {
    try {
      // setLoading(true);
      const response = await apiClient.get(`/analytics`);
      setCounts({
        userCounts: response.data.result.userCount,
        categoryCount: response.data.result.categoryCount,
        inspectionCount: response.data.result.inspectionCount,
      });
    } catch (err) {
      console.log(err);
    }
    // setLoading(false);
  };

  useEffect(() => {
    fetchCount();
  }, []);
  return (
    <>
      <div className="lg:mx-2 flex flex-col lg:flex-row justify-between items-stretch">
        <div className="flex flex-col w-full lg:w-[75%] mb-5 lg:mb-0">
          <div className="flex flex-col md:flex-row w-full justify-between">
            <StatsBox
              icon={<People />}
              heading="Active Employee"
              value={counts.userCounts}
            />
            <StatsBox
              icon={<Category />}
              heading="Total Categories"
              value={counts.categoryCount}
            />
            <StatsBox
              icon={<Category />}
              heading="Total Inspections"
              value={counts.inspectionCount}
            />
          </div>
          <div className="flex w-full justify-between relative">
            <RecentActivities />
          </div>
        </div>
        <div className="w-full lg:w-[25%] flex-grow">
          <IssuesOverview />
        </div>
      </div>
    </>
  );
};

export default StatRow;
