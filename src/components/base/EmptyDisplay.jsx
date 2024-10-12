import React from "react";
import EmptyAnimation from "../animations/EmptyAnimation";
const EmptyDisplay = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <span className="font-semibold text-xl text-black mb-4">
        No records exist
      </span>
      <EmptyAnimation />
    </div>
  );
};

export default EmptyDisplay;
