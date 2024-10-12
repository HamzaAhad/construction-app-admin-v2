import React from "react";

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
export default TabButton;
