/* import next */
import React, { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

/* import third party */
import axios from "axios";
import { Box, CardMedia, Modal, Backdrop } from "@mui/material";
import { toast } from "react-toastify";

/* import components */
import InputField from "@/components/base/InputField";
import FormButton from "@/components/base/FormButton";
import FormHeading from "@/components/base/FormHeading";
// import Animation from "@/components/animations/Animation";

import logo from "../../../public/pollo.json";

import Cookies from "js-cookie";

/* import validation */
import { changePassword, loginValidation } from "@/validations/validations";
import apiClient from "@/helpers/interceptor";

const Index = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    confirmPassword: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("bg-gradient-custom");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault(); // Prevent form reload

    let userId, scopesArray;
    if (window != undefined) {
      const loggedInUser =
        JSON.parse(localStorage.getItem("loggedInUser")) || {};
      const { id, firstName, lastName, email, phone, avatar } =
        loggedInUser?.user || {};
      scopesArray = loggedInUser?.userRoles?.scopes;
      userId = id;
    }
    if (!formData?.password || !formData?.confirmPassword) {
      return toast.error("Both fields are required.");
    }
    setLoading(true);
    try {
      const body = {
        isPasswordField: true,
        oldPassword: formData?.password,
        newPassword: formData?.confirmPassword,
      };
      const response = await apiClient.put(`/users/${userId}`, body);
      console.log("response", response);
      if (response) {
        toast.success("Password updated successfully.");
        setFormData({
          confirmPassword: "",
          password: "",
        });
        const allowedScope = scopesArray?.find((s) => s?.permissions?.viewAll);
        router.push(allowedScope?.page ? allowedScope?.page : "/dashboard");
      } else {
        toast.error(response?.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex relative flex-col lg:flex-row items-center justify-center min-h-screen">
      <Head>
        <title>SssManage Admin</title>
        <meta name="description" content="A simple custom form builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          position: "relative",
          // width: "25%",
          minHeight: "100vh",
        }}
        className={`${theme} w-[100%] lg:w-[25%]`}>
        <CardMedia
          component="img"
          image="/./profile.png"
          alt="Overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0.34,
            objectFit: "cover",
          }}
        />
      </Box>

      <div className="absolute lg:static top-1/4 flex  items-center justify-center  w-[90%]  lg:w-[75%] lg:min-h-screen bg-none lg:bg-[#edf5fa]">
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${
            true ? "opacity-100 visible" : "opacity-0 invisible"
          }`}>
          <div
            className="fixed inset-0 bg-black opacity-10 transition-opacity duration-500"
            onClick={() => {}}></div>
          <div
            className={`bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6 z-10 transform transition-all duration-300 ${
              true ? "scale-100" : "scale-95"
            }`}>
            <div className="p-6 w-full max-w-xl transform transition-transform duration-500 ease-in-out hover:scale-105">
              <FormHeading
                text="Change your password"
                extra="text-white lg:text-black"
              />
              <form onSubmit={handleChangePassword}>
                <InputField
                  label="Old Password"
                  name="password"
                  type="password"
                  placeholder="Enter old password"
                  value={formData.password}
                  onChange={handleChange}
                  extra="text-white lg:text-black"
                />
                <InputField
                  label="New Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Enter new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  extra="text-white lg:text-black"
                />

                <FormButton text="Change Passwrd" loading={loading} />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
