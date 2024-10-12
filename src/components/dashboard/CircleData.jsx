import React from "react";

const CircleData = () => {
  return (
    <div className="flex flex-col w-[45%] bg-white h-[300px] p-4 rounded-lg shadow">
      <div className="flex items-center justify-center w-full h-full">
        <div className="relative flex items-center justify-center w-4/5 h-4/5">
          <div className="absolute w-[250px] h-[200px] rounded-[100%] border-[16px]  border-buttonColorPrimary"></div>
          <div className="p-1 absolute flex flex-col items-center justify-center w-4/5 h-4/5 text-center text-lg font-semibold text-gray-700">
            <h2 className="text-xl font-semibold mb-4">
              Issues Reported Daily
            </h2>
            <p>
              <strong>8,200</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleData;
