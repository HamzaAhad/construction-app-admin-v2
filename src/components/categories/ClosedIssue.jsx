import React, { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

import Modal from "./GeneralModal";
import UploadImage from "../base/UploadImage";
import { CloudUpload, Delete } from "@mui/icons-material";

import "react-quill/dist/quill.snow.css"; // Import Quill's CSS
import apiClient from "@/helpers/interceptor";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import axios from "axios";

const ClosedIssue = ({ isOpen, onClose, recordId, text, refreshList }) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const router = useRouter();
  const currentRoute = router.route;
  const trimmedRoute = currentRoute.replace(/^\//, "");

  // const [image, setImage] = useState(null);
  const [remark, setRemark] = useState("");
  // const [fileName, setFileName] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [files, setFiles] = useState([]);
  const [image, setImage] = useState(null);

  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);

  const [actions, setActions] = useState([]); // To store added actions
  const [activeTab, setActiveTab] = useState("add"); // State to manage tabs

  const fileInputRef = useRef(null);

  // const handleImageUpload = async (file) => {
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   const { accessToken } = JSON.parse(localStorage.getItem("loggedInUser"));
  //   try {
  //     setImageUploading(true);
  //     const response = await axios.post(
  //       `${process.env.NEXT_PUBLIC_API_URL}/upload`,
  //       formData,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );
  //     setImageUploading(false);
  //     setFileName(response?.data?.fileName);
  //   } catch (err) {
  //     console.log("Error while uploading file", file);
  //   }
  // };

  // const clearModal = () => {
  //   setImage(null);
  //   setRemark("");
  //   setFileName("");
  // };

  // const handleSubmit = async () => {
  //   const body = {
  //     status: "close",
  //     actionImage: fileName,
  //     actionDescription: remark?.replace(/<\/?[^>]+(>|$)/g, ""),
  //   };
  //   console.log("body--->", body);
  //   if (imageUploading) {
  //     toast.error("Image is being uploaded please wait");
  //   } else {
  //     try {
  //       const response = await apiClient.put(
  //         `/${trimmedRoute}/${recordId}`,
  //         body
  //       );
  //       toast.success(response?.data?.message);
  //       onClose(false);
  //       clearModal();
  //       await refreshList();
  //     } catch (err) {
  //       toast.error(err?.response?.data?.message);
  //       console.log("Error--->", err);
  //     }
  //   }
  // };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append selected files
    setFileName(""); // Reset fileName when selecting new files
  };
  useEffect(() => {
    handleImageUpload();
  }, [files]);
  // Handle file upload to the server
  const handleImageUpload = async () => {
    if (files.length === 0) {
      // toast.error("No files selected.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // Add each file to FormData
    });

    const { accessToken } = JSON.parse(localStorage.getItem("loggedInUser"));
    setFileUploading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload/multiple`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setFileName((prevFileNames) => [
        ...prevFileNames,
        ...(response?.data?.fileNames || []),
      ]);
      toast.success("Files uploaded successfully.");
    } catch (err) {
      // toast.error("Error uploading files.");
    } finally {
      setFileUploading(false);
    }
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFileName((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleChange = (event) => {
    setDescription(event.target.value);
  };

  const clearModal = () => {
    setFiles([]);
    setDescription("");
    setActions([]);
    setFileName([]);
  };

  const addNewAction = () => {
    if (!remark || fileUploading) {
      toast.error(
        "Please complete the action details or wait for the upload to finish."
      );
      return;
    }

    const newAction = {
      description: remark?.replace(/<\/?[^>]+(>|$)/g, ""), // Clean up HTML tags
      images: fileName,
    };
    setActions((prevActions) => [...prevActions, newAction]); // Add new action
    setRemark("");
    setFiles([]); // Clear files after adding action
    setFileName([]);
  };

  const handleSubmit = async () => {
    if (fileUploading) {
      toast.error("Files are still uploading, please wait.");
      return;
    }
    const body = {
      // actions: [
      //   {
      //     images: fileName,
      //     description: remark?.replace(/<\/?[^>]+(>|$)/g, ""), // Remove HTML tags
      //   },
      // ],
      actions: actions,
      status: "close",
    };
    try {
      const response = await apiClient.put(
        `/${trimmedRoute}/${recordId}`,
        body
      );
      toast.success(response?.data?.message);
      onClose(false);
      clearModal();
      await refreshList();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const handleOnClose = () => {
    onClose(false);
    clearModal();
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleOnClose}
      onSave={handleSubmit}
      buttonText={text}
      bg="bg-buttonColorPrimary"
      title={text}>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          className={`px-4 py-2 text-black ${
            activeTab === "add" ? "bg-gray-200" : "bg-white"
          } rounded`}
          onClick={() => setActiveTab("add")}>
          Add Action
        </button>
        <button
          className={`px-4 py-2 text-black ${
            activeTab === "view" ? "bg-gray-200" : "bg-white"
          } rounded`}
          onClick={() => setActiveTab("view")}>
          View Actions
        </button>
      </div>
      {activeTab === "add" && (
        <div className="flex flex-col overflow-y-auto max-h-[60vh] justify-between">
          <div
            className="relative min-h-[20rem] flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={triggerFileInput}>
            {files.length === 0 ? (
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
                      className="absolute top-2 right-2 bg-white text-red-600 rounded-full p-2 shadow hover:bg-gray-200">
                      <Delete />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=""
            multiple
            onChange={handleFileChange}
          />
          {/* <UploadImage
          onImageUpload={handleImageUpload}
          image={image}
          setImage={setImage}
        /> */}
          <div className="w-[98%] py-4 max-w-lg relative border-2 border-dashed space-y-4 my-4 bg-gray-50 rounded-md">
            <h2 className="text-lg font-semibold">
              Describe action you have taken
            </h2>
            <ReactQuill
              value={remark}
              onChange={(e) => {
                setRemark(e);
              }}
              className="w-full h-48"
              style={{ color: "black" }}
            />
          </div>
          <button
            onClick={addNewAction}
            className="bg-buttonColorPrimary text-white px-4 py-2 mx-[1px] rounded mt-4">
            Add Action
          </button>
        </div>
      )}

      {activeTab === "view" && (
        <div className="p-4 overflow-y-auto max-h-[60vh]">
          {actions.length === 0 ? (
            <div className="text-gray-950">No actions added yet.</div>
          ) : (
            actions.map((action, index) => (
              <div key={index} className="mb-4 border-b pb-2">
                <p className="text-black">
                  <strong>Description:</strong> {action.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {action.images.map((img, i) => (
                    <img
                      key={i}
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`}
                      alt={`Action ${index + 1} Image ${i + 1}`}
                      className="h-20 w-20 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Modal>
  );
};

export default ClosedIssue;
