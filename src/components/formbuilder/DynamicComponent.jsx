import React, { useState, useRef, useMemo } from "react";
import SignatureCanvas from "react-signature-canvas";
import DynamicFileUploader from "./DynamicFileUploader";
import DisabledOverlay from "../base/DisabledLayout";

import axios from "axios";
import { toast } from "react-toastify";

import dynamic from "next/dynamic";
// import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill's CSS

function DynamicComponent({ type, addField }) {
  const ReactQuill = useMemo(
    () => dynamic(() => import("react-quill"), { ssr: false }),
    []
  );
  const [textValue, setTextValue] = useState(""); // State for text fields
  const [optionValues, setOptionValues] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [fileUploading, setFileUploading] = useState(false);
  const handleFileChange = async (e) => {
    setFileUploading(true);

    const file = e.target.files[0];
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
      console.log("File uploaded successfully");
      setUploadedFile(response?.data?.fileName);
      toast.success(response?.data?.message);
    } catch (err) {
      console.error("Error uploading file", err);
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    }
    setFileUploading(false);
  };
  const sigCanvas = useRef({});

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleOptionChange = (e) => {
    setOptionValues(e.target.value);
  };

  const handleEditorChange = (value) => {
    setTextValue(value);
  };

  const clearFile = () => {
    setUploadedFile(null);
    setTextValue(""); // Clear the text value
  };
  const clearText = () => {
    setTextValue(""); // Clear the text value
  };

  const clearSignature = () => {
    sigCanvas.current.clear();
  };

  const saveField = () => {
    console.log("save field", type, textValue);
    switch (type) {
      case "headline":
      case "paragraph":
      case "question":
        addField(
          {
            type,
            html: `<div>${textValue}</div>`,
          },
          {
            type,
            textValue,
          }
        );
        break;
      case "checkbox":
        addField(
          {
            type,
            html: `
        <div>
          <label className="flex flex-col space-y-2">
            ${textValue}
            <div className="flex flex-col space-y-2">
              ${optionValues
                .split(",")
                .map(
                  (option) => `
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={checkboxValue}
                    className="h-4 w-4"
                  />
                  <span>${option}</span>
                </div>
              `
                )
                .join("")}
            </div>
          </label>
        </div>
        `,
          },
          {
            type,
            textValue,
            optionValues,
          }
        );
        break;
      case "radio":
        addField(
          {
            type,
            html: `
              <div>
                <label className="flex flex-col space-y-2">
                  ${textValue}
                  <div className="flex flex-col space-y-2 mt-2">
                    ${optionValues
                      .split(",")
                      .map(
                        (option) => `
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="radio-option"
                          value="${option.toLowerCase().replace(/\s+/g, "-")}"
                          className="h-4 w-4"
                        />
                        <span>${option}</span>
                      </label>
                    `
                      )
                      .join("")}
                  </div>
                </label>
              </div>
          `,
          },
          {
            type,
            textValue,
            optionValues,
          }
        );
        break;
      case "date":
        addField(
          {
            type,
            html: `
      <div class="relative space-y-2">
        <div>${textValue}</div>
        <div class="p-4 rounded-md flex flex-col items-center bg-white">
          <input
            type="date"
            name="date"
            disabled
            class="w-full h-12 border border-black rounded-md p-2 bg-white"
          />
        </div>
      </div>`,
          },
          {
            type,
            textValue,
          }
        );
        break;

      case "e-sign":
        const dataUrl = sigCanvas.current
          .getTrimmedCanvas()
          .toDataURL("image/png");
        addField(
          {
            type,
            html: `<img src="${dataUrl}" alt="Signature" />`,
          },
          {
            type,
            textValue,
            html: `<img src="${dataUrl}" alt="Signature" />`,
            src: dataUrl,
          }
        );
        break;
      case "user-e-sign":
        addField(
          {
            type,
            html: `
      <div class="relative space-y-2">
        <div>${textValue}</div>
        <div class="border border-dashed border-gray-400 p-4 rounded-md flex justify-center items-center">
          <span class="text-gray-600">Sign here</span>
        </div>
      </div>`,
          },
          {
            type,
            textValue,
          }
        );
        break;
      case "upload-image":
        const src = `${process.env.NEXT_PUBLIC_API_URL}/uploads/${uploadedFile}`;
        addField(
          {
            type,
            html: `<div><img src="${src}" alt="Uploaded Image" /></div>`,
          },
          {
            type,
            src,
            html: `<div><img src="${src}" alt="Uploaded Image" /></div>`,
          }
        );
        break;
      case "uploader":
        addField(
          {
            type,
            html: `
      <div class="relative space-y-2">
        <div>${textValue}</div>
        <div class="border border-dashed border-gray-400 p-4 rounded-md flex justify-center items-center">
          <span class="text-gray-600">Upload here</span>
        </div>
      </div>`,
          },
          {
            type,
            textValue,
          }
        );
      default:
        break;
    }
  };

  const renderField = (field) => {
    switch (field) {
      case "headline":
        return (
          <div className="relative space-y-4 p-4 mt-2 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">Headline</h2>
            <input
              type="text"
              placeholder="Enter Headline"
              value={textValue}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md"
            />
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearText}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>

              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );

      case "date":
        return (
          <div className="relative space-y-4 p-4 mt-2 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">Date Field</h2>
            <input
              type="text"
              placeholder="Enter Label"
              value={textValue}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md"
            />

            <div className="relative">
              <DisabledOverlay message="Disabled" />{" "}
              <input
                type="date"
                className="w-full p-2 border rounded-md bg-gray-200 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearText}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );

      case "paragraph":
        return (
          <div className="relative space-y-4 p-4 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">Paragraph</h2>
            <ReactQuill
              value={textValue}
              onChange={handleEditorChange}
              className="w-full h-36"
            />
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearText}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );
      case "question":
        return (
          <div className="relative space-y-4 p-4 mt-2 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">Question</h2>
            <input
              type="text"
              placeholder="Enter Question"
              value={textValue}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md"
            />
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearText}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>

              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <div className="relative space-y-4 p-4 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">Checkbox</h2>
            <label className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Enter Undertaking"
                value={textValue}
                onChange={handleTextChange}
                className="w-full p-2 border rounded-md"
              />
            </label>
            <h2 className="text-xl font-semibold">
              Enter Checkbox Options (Comma Separated)
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Yes,No,Not Specified"
                value={optionValues}
                onChange={handleOptionChange}
                className="w-full p-2 border rounded-md"
              />
            </label>
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearText}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );

      case "radio":
        return (
          <div className="relative space-y-4 p-4 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">Radio</h2>
            <input
              type="text"
              placeholder="Enter Label"
              value={textValue}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md"
            />
            <h2 className="text-xl font-semibold">
              Enter Checkbox Options (Comma Separated)
            </h2>
            <label className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Yes,No,Not Specified"
                value={optionValues}
                onChange={handleOptionChange}
                className="w-full p-2 border rounded-md"
              />
            </label>
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearText}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );

      case "upload-image":
        return (
          <div className="relative space-y-4 p-4 mt-2 h-80 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upload Image</h2>
              {fileUploading && (
                <span className="ml-4 flex items-center space-x-2">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
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
            </div>
            <DynamicFileUploader
              onChange={handleFileChange}
              accept="image/*"
              placeholder="Upload a file here"
            />
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearFile}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );
      case "uploader":
        return (
          <div className="relative space-y-4 p-4 mt-2 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">User File Uploader</h2>
            <input
              type="text"
              placeholder="Enter Label"
              value={textValue}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md"
            />
            <div className="relative">
              <DisabledOverlay message="Disabled" />{" "}
              <DynamicFileUploader
                onChange={handleFileChange}
                accept="*/*"
                placeholder="Set Uploader for user to upload file"
                disabled={true}
              />
            </div>

            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearFile}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );

      case "e-sign":
        return (
          <div className="relative space-y-4 p-4 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">E-sign</h2>

            <SignatureCanvas
              ref={sigCanvas}
              canvasProps={{
                width: 500,
                height: 150,
                style: { border: "1px solid #ddd", borderRadius: "8px" },
              }}
            />
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearSignature}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );

      case "user-e-sign":
        return (
          <div className="relative space-y-4 p-4 h-80 bg-gray-50 rounded-md">
            <h2 className="text-xl font-semibold">
              User E-sign (for user to sign on the filled form)
            </h2>
            <input
              type="text"
              placeholder="Enter Label"
              value={textValue}
              onChange={handleTextChange}
              className="w-full p-2 border rounded-md"
            />
            <div className="relative">
              <DisabledOverlay message="Disabled" />{" "}
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  width: 500,
                  height: 150,
                  style: {
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    pointerEvents: "none", // Disable pointer events
                  },
                }}
              />
              {/* Overlay with a message */}
            </div>
            <div className="absolute bottom-4 right-4 flex space-x-4">
              <button
                onClick={clearSignature}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={saveField}
                className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderField(type)}</div>;
}

export default DynamicComponent;
