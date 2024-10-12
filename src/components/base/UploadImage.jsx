import React, { useEffect, useState } from "react";
import { CloudUpload, Delete } from "@mui/icons-material";

const UploadImage = ({ onImageUpload, image, setImage }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    onImageUpload(file);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        // onImageUpload(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    onImageUpload(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 mt-4">
      <div
        className="relative h-64 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
        onClick={() => document.getElementById("fileInput").click()}>
        {!image ? (
          <div className="flex flex-col items-center text-gray-500">
            <CloudUpload fontSize="large" />
            <span className="mt-2 text-sm text-center">
              Drag and drop an image here or click to browse
            </span>
          </div>
        ) : (
          <div className="relative">
            <img
              src={image}
              alt="Uploaded"
              className="object-contain h-64 w-full rounded-lg"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-2 shadow hover:bg-gray-200">
              <Delete />
            </button>
          </div>
        )}
      </div>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </div>
  );
};

export default UploadImage;
