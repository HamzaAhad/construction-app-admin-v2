import React, { useState, useRef } from "react";
// import { CloudUpload, Delete } from "@mui/icons-material";

import Modal from "./GeneralModal";
import UploadImage from "@/components/base/UploadImage";

import { toast } from "react-toastify";
import axios from "axios";
import apiClient from "@/helpers/interceptor";

const FileUploader = ({ isOpen, onClose, refreshList }) => {
  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);

  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    setFileUploading(true);
    setFileName("");
    const formData = new FormData();
    formData.append("file", file);
    const { accessToken } = JSON.parse(localStorage.getItem("loggedInUser"));
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFileName(response?.data?.fileName);
    } catch (err) {
      console.log("Error while uploading file", file);
    }
    setFileUploading(false);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const clearModal = () => {
    setFiles([]);
    setDescription("");
  };

  const handleSubmit = async () => {
    // const images = files?.map((file) => file?.name);
    const body = {
      images: [fileName],
      description: description?.replace(/<\/?[^>]+(>|$)/g, ""),
    };
    try {
      setLoading(true);
      const response = await apiClient.post("/tickets", body);
      toast.success(response?.data?.message);
      onClose(false);
      clearModal();
      await refreshList();
    } catch (err) {
      toast.error(err?.response?.data?.message);
      console.log("Error--->", err);
    } finally {
      setLoading(false);
    }
    // Perform submit logic here
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSubmit}
      buttonText="Add Ticket"
      bg="bg-buttonColorPrimary"
      setImages={setFiles}
      title="Add Ticket"
      loading={loading}>
      <div className="flex flex-col w-[100%] space-y-4 overflow-y-auto max-h-[60vh] justify-between">
        <div className="flex flex-col w-full space-y-2 px-2">
          <label className="text-start text-lg font-medium">Add Image</label>
          {/* <div
            className="relative h-64 flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={triggerFileInput}
          > */}
          {/* {files.length === 0 ? (
              <div className="flex flex-col items-center text-gray-500">
                <CloudUpload fontSize="large" />
                <span className="mt-2 text-sm px-2 text-center">
                  Drag and drop files here or click to browse
                </span>
              </div>
            ) : (
              <div className="flex flex-wrap justify-around overflow-y-auto bg-gray-50 h-64 gap-4 p-2">
                {files.map((file, index) => (
                  <div key={index} className="relative ">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Uploaded ${index}`}
                        className="object-contain h-32 w-48 rounded-lg"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 border rounded-lg">
                        <span>{file.name}</span>
                      </div>
                    )}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-2 shadow hover:bg-gray-200"
                    >
                      <Delete />
                    </button>
                  </div>
                ))}
              </div>
            )} */}
          {/* </div> */}
          {/* <input
            type="file"
            ref={fileInputRef}
            className="hidden" */}
          {/* // accept="" */}
          {/* // multiple */}
          {/* onChange={handleFileChange}
          /> */}
          {fileUploading && (
            <span className="ml-4 flex items-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 1116 0 8 8 0 01-16 0zm8 4v-4h4v4h-4zm0-8v4h4V8h-4z"
                />
              </svg>
              <span className="text-sm text-gray-500">
                File is uploading to server
              </span>
            </span>
          )}
          <UploadImage
            onImageUpload={handleImageUpload}
            image={image}
            setImage={setImage}
          />
        </div>
        <div className="flex flex-col w-full space-y-2 px-2">
          <label className="text-start text-lg font-medium">Description</label>
          <textarea
            placeholder="Enter description here..."
            className="mb-2 p-2 border-2 border-dashed rounded-lg focus:outline-none text-black"
            rows="6"
            value={description}
            onChange={handleChange}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FileUploader;
