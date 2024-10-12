import React from "react";

const DynamicFileUploader = ({ onChange, accept, placeholder, disabled }) => {
  return (
    <div className="relative space-y-4 mt-2 rounded-md">
      <input
        type="file"
        onChange={onChange}
        accept={accept}
        className="w-full p-2 border rounded-md"
        disabled={disabled}
      />
      <p className="mt-2 text-gray-500">{placeholder}</p>
    </div>
  );
};

export default DynamicFileUploader;
