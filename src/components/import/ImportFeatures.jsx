import React, { useState } from "react";

import {
  FaUsers,
  FaBuilding,
  FaFolder,
  FaCog,
  FaFileAlt,
} from "react-icons/fa";

const ImportFeatures = ({ selectedItem, setSelectedItem }) => {
  const features = [
    // { name: "clients", icon: <FaUsers className="text-2xl" /> },
    { name: "employees", icon: <FaBuilding className="text-2xl" /> },
    // { name: "categories", icon: <FaFolder className="text-2xl" /> },
    // { name: "reports", icon: <FaFileAlt className="text-2xl" /> },
    // { name: "settings", icon: <FaCog className="text-2xl" /> },
  ];

  return (
    <div className="bg-white rounded-lg w-full h-[90%] p-6 flex flex-col items-center shadow-sm mt-4 lg:mt-20">
      <h1 className="text-2xl font-semibold mb-6">Select Import Type</h1>
      <ul className="w-full flex-1 space-y-4 overflow-y-auto">
        {features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer ${
              selectedItem === feature?.name
                ? "bg-buttonColorPrimary text-white"
                : "text-black"
            } hover:bg-buttonColorPrimary hover:text-white transition-colors duration-200`}
            onClick={() => {
              setSelectedItem(feature?.name);
            }}>
            {feature.icon}
            <span className="text-lg">{feature.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ImportFeatures;
