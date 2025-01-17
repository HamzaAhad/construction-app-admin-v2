import React, { useState } from "react";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [inputValue, setInputValue] = useState(""); // Email/Phone input value
  const [isSubmitting, setIsSubmitting] = useState(false); // API call loading state
  const [successMessage, setSuccessMessage] = useState(""); // Success message

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      // Simulate API call for password reset
      const body = { email: inputValue };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        body
      );
      console.log("response", response);
      setSuccessMessage(response?.data?.message);
      setInputValue(""); // Clear input after success
    } catch (error) {
      console.log("Error resetting password:", error);
      setSuccessMessage("Failed to send the reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}>
      <div
        className="fixed inset-0 bg-black opacity-10 transition-opacity duration-500"
        onClick={onClose}></div>
      <div
        className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-10 transform transition-all duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Forgot Password
          </h2>
        </div>

        {!successMessage ? (
          <>
            <div className="mb-4">
              <label
                htmlFor="emailOrPhone"
                className="block text-sm font-medium text-gray-700 mb-2">
                Enter your email or phone number:
              </label>
              <input
                id="emailOrPhone"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Email or Phone"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-buttonColorPrimary"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !inputValue}
                className={`bg-buttonColorPrimary text-white px-4 py-2 rounded-lg ${
                  isSubmitting || !inputValue
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-buttonColorPrimary"
                }`}>
                {isSubmitting ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-500 font-medium mb-4">{successMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage(null);
                onClose();
              }}
              className="bg-buttonColorPrimary text-white px-4 py-2 rounded-lg hover:opacity-[80%]">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
