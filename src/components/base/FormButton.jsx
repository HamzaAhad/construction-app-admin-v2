import { CircularProgress } from "@mui/material";
import React from "react";

const FormButton = ({ text, loading }) => {
  return (
    <button
      type="submit"
      className="w-full bg-buttonColorPrimary text-lg font-bold text-white p-2 rounded mt-4 hover:bg-buttonColorPrimary transform transition-transform duration-500 ease-in-out hover:bg-blue-600">
      {loading ? (
        // <CircularProgress color="inherit" className="w-4 h-4" />
        <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
      ) : (
        text
      )}
    </button>
  );
};

export default FormButton;
