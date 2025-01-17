/* import next */
import React, { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

/* import third party */
import axios from "axios";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import CardMedia from "@mui/material/CardMedia";

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

    if (!formData?.password || !formData?.confirmPassword) {
      return toast.error("Both fields are required.");
    }
    if (formData?.password != formData?.confirmPassword) {
      return toast.error("Passwords does not match.");
    }
    setLoading(true);
    try {
      const body = {
        password: formData?.password,
      };
      const token = router.query?.token;
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the Bearer token
          },
        }
      );
      console.log("response", response);
      if (response) {
        toast.success("Password reset successfully.");
        setFormData({
          confirmPassword: "",
          password: "",
        });
        router.push("/login");
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
        <div className="p-6 w-full max-w-xl transform transition-transform duration-500 ease-in-out hover:scale-105">
          <FormHeading text="Reset Password" extra="text-white lg:text-black" />
          <form onSubmit={handleChangePassword}>
            <InputField
              label="New Password"
              name="password"
              type="password"
              placeholder="Enter new password"
              value={formData.password}
              onChange={handleChange}
              extra="text-white lg:text-black"
            />
            <InputField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              placeholder="Re enter new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              extra="text-white lg:text-black"
            />

            <FormButton text="Reset Password" loading={loading} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
