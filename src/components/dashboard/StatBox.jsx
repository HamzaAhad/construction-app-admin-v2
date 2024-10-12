import React from "react";

const StatsBox = ({ heading, value, icon }) => {
  return (
    <div
      className={`md:w-[30%] lg:w-[160px] xl:min-w-[29%] xxl:min-w-[29%] mb-2 p-4 lg:mx-4 bg-white shadow animate-slideTop rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}>
      <div className="lg:px-0 xl:px-4 flex flex-col items-center">
        <h3 className="text-lg font-semibold text-buttonColorPrimary mb-2">
          {heading}
        </h3>
        <div className="flex items-center space-x-4">
          {icon && (
            <div className="text-buttonColorPrimary text-4xl animate-bounce">
              {icon}
            </div>
          )}
          <p className="text-3xl font-bold text-black animate-pulse">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsBox;
