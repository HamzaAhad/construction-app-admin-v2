import React, { useState } from "react";

import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";

import axios from "axios";
import { CardMedia, Box } from "@mui/material";
import { toast } from "react-toastify";

import InputField from "@/components/base/InputField";
import FormButton from "@/components/base/FormButton";
import FormHeading from "@/components/base/FormHeading";
import Animation from "@/components/animations/Animation";

import logo from "../../../public/pollo.json";

import { signupValidation } from "@/validations/validations";

import Cookies from "js-cookie";
import AvatarUpload from "@/components/listing/AvatarUpload";

const SignUp = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: null,
    password: "",
    companyName: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // if (touched[name]) {
    //   signupValidation
    //     .validateAt(name, { [name]: value })
    //     .then(() => {
    //       setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    //     })
    //     .catch((err) => {
    //       setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
    //     });
    // }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));

    // signupValidation
    //   .validateAt(name, { [name]: value })
    //   .then(() => {
    //     setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    //   })
    //   .catch((err) => {
    //     setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
    //   });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupValidation.validate(formData, { abortEarly: false });
      setErrors({});
      const dataToSend = { ...formData };

      // Check if phone is null, and if so, remove it from dataToSend
      if (dataToSend.phone === null) {
        delete dataToSend.phone;
      }

      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signup`,
        dataToSend
      );
      toast.success(response?.data?.message);
      setLoading(false);
      // Cookies.set("loggedInUser", JSON.stringify(response?.data), {
      //   expires: 30, // 30 days
      //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      //   sameSite: "strict", // Protect against CSRF attacks
      //   path: "/", // Accessible throughout your site
      // });
      // localStorage.setItem("loggedInUser", JSON.stringify(response?.data));
      router.push("/login");
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
        setLoading(false);
        toast.error(err.response.data.message);
        setErrors({ server: err.response.data.message });
      } else if (err.inner) {
        const newErrors = {};
        err.inner.forEach((error) => {
          newErrors[error.path] = error.message;
        });
        setErrors(newErrors);
      } else {
        console.log("Unexpected error:", err);
      }
    }
  };
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* <div className="w-[25%] min-h-screen bg-gradient-custom"></div> */}
      <Head>
        <title>Sign Up</title>
        <meta name="description" content="Sign up page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        className={` relative w-[100%] lg:w-[25%] min-h-[130vh] lg:min-h-[100vh] bg-gradient-custom`}>
        {/* <div className="flex items-center justify-center mt-20 mb-10 h-1">
          <Animation path={logo} />
        </div> */}
        <div className="flex items-center justify-start mx-8 mt-5 mb-5 h-11">
          <div className="text-4xl font-galada font-bold text-transparent bg-gradient-to-r from-[#3a9dbd] to-[#5bc1da] bg-clip-text animate-gradient mx-auto">
            SssManage
          </div>
          <div className="relative ml-3 flex-shrink-0 rounded-full w-2 h-2 bg-[#5bc1da] animate-ping"></div>
        </div>
        <CardMedia
          component="img"
          image="/./profile.png"
          alt="Overlay"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            opacity: 0.34,
            objectFit: "cover",
          }}
          className="min-h-[130vh] lg:min-h-[100vh]"
        />
      </Box>

      <div className="absolute lg:static top-[20%] flex items-center justify-center w-[90%]  lg:w-[75%] lg:min-h-screen bg-none lg:bg-[#edf5fa]">
        <div className="px-6 py-2 lg:p-6 w-full max-w-xl transform transition-transform duration-500 ease-in-out hover:scale-105">
          <FormHeading
            text="Create your account"
            extra="text-white lg:text-black"
          />
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between flex-col lg:flex-row gap-0">
              <div className="lg:w-[45%]">
                <InputField
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                  error={errors.firstName}
                  isSignup={true}
                  extra="text-white lg:text-black"
                />
              </div>
              <div className="lg:w-[45%]">
                <InputField
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                  error={errors.lastName}
                  isSignup={true}
                  extra="text-white lg:text-black"
                />
              </div>
            </div>
            <div className="flex justify-between flex-col lg:flex-row gap-0">
              <div className="lg:w-[45%]">
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  // onBlur={handleBlur}
                  error={errors.email}
                  isSignup={true}
                  extra="text-white lg:text-black"
                />
              </div>
              <div className="lg:w-[45%]">
                <InputField
                  label="Phone Number"
                  name="phone"
                  type="text"
                  placeholder="eg: +923472907283"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={() => {}}
                  error={errors.phone}
                  isSignup={true}
                  extra="text-white lg:text-black"
                />
              </div>
            </div>
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              // onBlur={handleBlur}
              error={errors.password}
              isSignup={true}
              extra="text-white lg:text-black"
            />
            <InputField
              label="Company Name"
              name="companyName"
              type="text"
              placeholder="Enter your company name"
              value={formData.companyName}
              onChange={handleChange}
              // onBlur={handleBlur}
              error={errors.companyName}
              isSignup={true}
              extra="text-white lg:text-black"
            />
            <div>
              <FormButton text="Sign Up" loading={loading} />
            </div>
          </form>
          <div className="mt-4 px-2 lg:px-0 text-center">
            <Link
              href="/login"
              className="text-white lg:text-buttonColorPrimary  hover:underline">
              Already associated to a company ? Click here to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
