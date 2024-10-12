import { CircularProgress } from "@mui/material";
import React from "react";

const Modal = ({
  isOpen,
  onClose,
  onSave,
  title,
  onError,
  children,
  buttonText,
  bg,
  setImages,
  loading = false,
}) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-100 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}>
      <div
        className="fixed inset-0 bg-black opacity-10 transition-opacity duration-500"
        onClick={() => {
          if (onError) {
            onError("");
          }
          onClose(false);
        }}></div>
      <div
        className={`bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 z-10 transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}>
        <div className="flex justify-between items-center mb-4 shadow">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="mb-4">{children}</div>
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (onError) {
                onError("");
              }
              if (setImages) {
                setImages([]);
              }
              onClose(false);
            }}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2">
            Cancel
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className={`${bg} hover:${bg} text-white px-4 py-2 rounded-lg`}>
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              ) : (
                buttonText
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
