import React from "react";
import Spreadsheet from "react-spreadsheet";

import DownloadCSV from "@/components/import/DownloadCsv";

import { data } from "@/data/spreadsheet";

const SpreadsheetComponent = ({ selectedItem }) => {
  // Check if data and selectedItem are valid, and if data[selectedItem] exists
  const spreadsheetData =
    data && data[selectedItem]
      ? data[selectedItem]
      : Array.from({ length: 7 }, () => Array(9).fill("")); // Default array if key does not exist

  return (
    <div className="max-w-{80%] overflow-hidden mr-auto p-8 mt-8 bg-white rounded-lg shadow-md">
      <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Import Data Format</h2>
        <DownloadCSV />
      </div>
      <div className="w-full overflow-x-auto scrollbar-custom">
        <Spreadsheet data={spreadsheetData} />
      </div>
    </div>
  );
};

export default SpreadsheetComponent;
