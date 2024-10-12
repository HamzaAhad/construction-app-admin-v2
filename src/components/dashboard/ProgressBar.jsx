import React, { useEffect, useState } from "react";

const ProgressBar = ({ percentage, color }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100); // Delay to trigger the animation
  }, []);

  return (
    <div className="w-full h-2 bg-gray-200 rounded-lg overflow-hidden animate-bounce">
      <div
        className={`h-full rounded-lg ${color} transform transition-transform duration-700 ${
          isVisible ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default ProgressBar;
