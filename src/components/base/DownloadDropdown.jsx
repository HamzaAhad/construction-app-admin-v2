import React, { useState } from "react";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { saveAs } from "file-saver";
import { Menu, MenuItem, Button, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import apiClient from "@/helpers/interceptor";

const DownloadDropdown = ({ data, csvName = "Data" }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  // const filteredData = () => {
  //   const updatedData = data.map((item) => {
  //     const {
  //       controlAction,
  //       viewCloseAction,
  //       categoryAction,
  //       formIssue,
  //       updateStatus,
  //       viewItem,
  //       folderId,
  //       formId,
  //       actionImage,
  //       completedAt,
  //       longitude,
  //       latitude,
  //       updatedAt,
  //       content,
  //       ...rest
  //     } = item;
  //     return rest;
  //   });
  //   return updatedData;
  // };
  // const handleExportCSV = async () => {
  //   const newData = filteredData();
  //   const workbook = new ExcelJS.Workbook();
  //   const sheet = workbook.addWorksheet("Data");

  //   const columns = Object.keys(newData[0]).map((key) => ({
  //     header: key.toUpperCase(),
  //     key: key,
  //     width: 20,
  //   }));

  //   sheet.columns = columns;

  //   newData.forEach((row) => {
  //     sheet.addRow(row);
  //   });

  //   const buffer = await workbook.csv.writeBuffer();
  //   const blob = new Blob([buffer], { type: "text/csv" });
  //   saveAs(blob, `${csvName}.csv`);
  // };
  const filteredData = () => {
    const updatedData = data.map((item) => {
      const {
        controlAction,
        viewCloseAction,
        categoryAction,
        formIssue,
        updateStatus,
        viewItem,
        folderId,
        formId,
        actionImage,
        completedAt,
        longitude,
        latitude,
        updatedAt,
        content,
        jsonContent,
        alreadyLoggedIn,
        image,
        details,
        password,
        parentId,
        eventImages,
        issuesImages,
        actions,
        ...rest
      } = item;
      return rest;
    });
    return updatedData;
  };

  const handleExportCSV = async () => {
    const newData = filteredData();
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Data");

    // Customize columns with header names and widths
    const columns = Object.keys(newData[0]).map((key) => ({
      header: key.toUpperCase(),
      key: key,
      width: key.length > 15 ? 45 : 25, // Adjust width based on header length
    }));
    sheet.columns = columns;

    // Apply header styles
    sheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF4F81BD" }, // Blue background color
      };
      cell.font = {
        name: "Arial",
        family: 2,
        size: 12,
        bold: true,
        color: { argb: "FFFFFFFF" }, // White font color
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
    });

    // Add data rows with custom styles
    newData.forEach((rowData, rowIndex) => {
      const row = sheet.addRow(rowData);
      row.eachCell((cell, colNumber) => {
        cell.font = {
          name: "Arial",
          size: 10,
          color: { argb: "FF000000" },
        };
        cell.alignment = {
          vertical: "top",
          horizontal: "center",
        };

        // Conditionally style specific columns (e.g., column with large text)
        if (colNumber === 2 && cell.value.length > 20) {
          sheet.mergeCells(
            rowIndex + 2,
            colNumber,
            rowIndex + 2,
            colNumber + 1
          );
        }
      });
    });

    // Write and download CSV file
    // const buffer = await workbook.csv.writeBuffer();
    // const blob = new Blob([buffer], { type: "text/csv" });
    // saveAs(blob, `${csvName}.csv`);
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${csvName || "export"}.xlsx`);
  };

  const handleDownloadPDF = async () => {
    try {
      const body = JSON.stringify(data);
      const newData = filteredData();
      const response = await apiClient.post(`/pdf`, newData, {
        responseType: "arraybuffer",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "data.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div className="bg-green-600 rounded-[12px] px-4 h-[40px]">
      <IconButton onClick={handleExportCSV}>
        <DownloadIcon className="text-gray-50" />
        <span className="ml-2 text-gray-100 text-[16px]">Download CSV</span>
      </IconButton>

      {/* Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}>
        <MenuItem
          onClick={() => {
            handleExportCSV();
            handleCloseMenu();
          }}>
          Download as CSV
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleDownloadPDF();
            handleCloseMenu();
          }}>
          Download as PDF
        </MenuItem>
      </Menu>
    </div>
  );
};

export default DownloadDropdown;
