import React from "react";

const PreviewField = ({ label, answer }) => {
  return (
    <div className="flex flex-col mt-1 px-2">
      <label className="text-black text-[16px]  font-medium">{label}</label>
      <div className="w-full border rounded p-2 my-2 bg-gray-100 text-black text-sm">
        {answer}
      </div>
    </div>
  );
};

export default PreviewField;
