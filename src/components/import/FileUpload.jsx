import React, { useState } from "react";
import axios from "axios";

import { toast } from "react-toastify";

const FileUploadComponent = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Simulate file upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10; // Simulate progress
        });
      }, 200);
    }
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const { accessToken } = JSON.parse(localStorage.getItem("loggedInUser"));
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/import/employee`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("File uploaded successfully");
      toast.success(response?.data?.message);
    } catch (err) {
      console.error("Error uploading file", err);
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mr-auto p-8 mt-10 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-6">Add new</h2>
        {loading && (
          <span className="text-base text-gray-600">
            Importing data in process...
          </span>
        )}
      </div>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-6">
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-gray-500 hover:text-gray-700 text-lg"
        >
          Drag & Drop or{" "}
          <span className="text-buttonColorPrimary">Choose file</span> to upload
        </label>
        {file && (
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <span className="text-lg">{file.name}</span>
              <span className="text-lg">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
              <div
                className="bg-buttonColorPrimary h-4 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">
          Import from URL
        </label>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Add file URL"
          className="border border-gray-300 text-black rounded-md p-3 w-full mb-4 focus:border-buttonColorPrimary focus:outline-none"
        />
        <button
          onClick={handleUpload}
          className={`w-full ${
            loading ? "bg-gray-500 cursor-not-allowed" : "bg-buttonColorPrimary"
          } text-white rounded-md p-3 text-base flex items-center justify-center`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 1 1 8 8 8 8 0 0 1-8-8zm8 0a4 4 0 1 0 4-4 4 4 0 0 0-4 4z"
                ></path>
              </svg>
              Importing...
            </>
          ) : (
            "Upload"
          )}
        </button>
      </div>
    </div>
  );
};

export default FileUploadComponent;
