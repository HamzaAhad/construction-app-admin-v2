import React, { useState } from "react";

const DownloadCSV = () => {
  const [data, setData] = useState([]);

  // Provided data
  const initialData = [
    {
      firstName: "Emily",
      lastName: "Green",
      email: null,
      roleTitle: "User",
      phone: "+92123456789",
    },
    {
      firstName: "James",
      lastName: "White",
      email: null,
      roleTitle: "User",
      phone: "+92123456721",
    },
    {
      firstName: "Olivia",
      lastName: "Brown",
      email: "olivia.brown@example.com",
      roleTitle: "User",
      phone: "+92123456757",
    },
    {
      firstName: "Liam",
      lastName: "Johnson",
      email: "liam.johnson@example.com",
      roleTitle: "User",
      phone: null,
    },
    {
      firstName: "Sophia",
      lastName: "Wilson",
      email: "sophia.wilson@example.com",
      roleTitle: "User",
      phone: null,
    },
  ];

  // Function to convert JSON to CSV
  const convertToCSV = (jsonData) => {
    const headers = Object.keys(jsonData[0]).join(",");
    const rows = jsonData.map((row) => Object.values(row).join(","));
    return [headers, ...rows].join("\n");
  };

  // Function to download CSV
  const downloadCSV = () => {
    setData(initialData);
    const csvData = convertToCSV(initialData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "employee.csv");
    link.click();
  };

  return (
    <div className="text-green-600 cursor-pointer mt-4" onClick={downloadCSV}>
      Click here to download the CSV
    </div>
  );
};

export default DownloadCSV;
