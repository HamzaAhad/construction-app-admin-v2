import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const PermissionListing = () => {
  const router = useRouter();
  const { id } = router.query;
  const [checkLoading, setChecktLoading] = useState(true);

  // Sample job data
  const jobs = [
    { id: 1, title: "Manage Dashboard", page: "/dashboard" },
    { id: 2, title: "Manage Inspection", page: "/issues" },
    { id: 3, title: "Manage Events", page: "/events" },
    { id: 4, title: "Manage Sites", page: "/sites" },
    { id: 5, title: "Manage Category", page: "/category" },
    { id: 6, title: "Manage Employee", page: "/employee" },
    { id: 7, title: "Manage Roles", page: "/roles" },
    { id: 8, title: "Manage Tickets", page: "/tickets" },
    { id: 9, title: "Manage System Logs", page: "/system-logs" },
    { id: 10, title: "Manage Imports", page: "/import" },
  ];
  const [jobPermissions, setJobPermissions] = useState(
    jobs.map((job) => ({
      id: job.id,
      title: job.title,
      page: job.page,
      permissions: {
        viewAll: false,
        editAll: false,
      },
    }))
  );
  const handleCheckboxChange = (jobId, permission) => {
    setJobPermissions((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? {
              ...job,
              permissions: {
                ...job.permissions,
                [permission]: !job.permissions[permission], // Toggle the permission
              },
            }
          : job
      )
    );
  };
  const handleSetPermissions = async () => {
    try {
      const response = await apiClient.put(`/roles/${id}`, {
        scopes: jobPermissions,
      });
      toast.success(response?.data?.message);

      await refreshList();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await apiClient.get(`/roles/${id}`);
      if (
        response?.data?.result?.scopes &&
        response?.data?.result?.scopes?.length
      ) {
        setJobPermissions(response?.data?.result?.scopes);
      }
      console.log(response);
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("User");
      fetchData();
      const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
      const roleTitle = loggedInUser?.user?.roleTitle;

      // if (roleTitle === "User") {
      // router.push("/404");
      // } else {
      setChecktLoading(false); // Only set loading to false if the user is authorized
      // }
    }
  }, [router]);

  // Render nothing or a loading state until the user role is determined
  if (checkLoading) {
    return null; // or a spinner/loading indicator if you prefer
  }

  // Example permission titles
  const permissions = ["View All", "Edit All"];

  return (
    <div className="p-6 bg-gray-50 shadow">
      <div className=" flex flex-col gap-y-4 border border-gray-400 rounded">
        <div className="flex justify-between bg-gray-200 p-2 border-b border-gray-400">
          <h1 className="font-semibold w-1/2">Jobs</h1>
          <div className="flex justify-around space-x-2 w-1/2">
            {permissions?.map((perm, index) => (
              <div key={index} className="font-semibold">
                <h1>{perm}</h1>
              </div>
            ))}
          </div>
        </div>
        {jobPermissions?.map((job) => (
          <div key={job.id} className="flex justify-start bg-gray-100 p-2">
            <h1 className="w-1/2">{job.title}</h1>
            <div className="flex justify-around w-1/2">
              {permissions.map((perm, index) => (
                <div key={index} className="text-center">
                  <label>
                    <input
                      type="checkbox"
                      checked={
                        job.permissions[
                          perm == "View All" ? "viewAll" : "editAll"
                        ]
                      }
                      onChange={() =>
                        handleCheckboxChange(
                          job.id,
                          perm == "View All" ? "viewAll" : "editAll"
                        )
                      }
                      // className="w-6 h-6 border-gray-300 rounded-md appearance-auto checked:bg-white checked:border-blue-500 transition-all duration-300 ease-in-out peer mr-2"
                      className="absolute opacity-0 cursor-pointer w-6 h-6"
                    />
                    <span className="w-6 h-6 border border-gray-300 rounded-md flex items-center justify-center transition-colors duration-300 ease-in-out mr-2">
                      <span
                        className={`w-4 h-4 rounded-md ${
                          job.permissions[
                            perm === "View All" ? "viewAll" : "editAll"
                          ]
                            ? "bg-blue-500"
                            : "bg-gray-400"
                        } transition-all duration-300 ease-in-out`}></span>
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSetPermissions}
        className="flex justify-end items-end p-2 rounded-2xl ml-auto my-2 text-white bg-buttonColorPrimary">
        Set Permission
      </button>
    </div>
  );
};

export default PermissionListing;
