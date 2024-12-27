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
import { loginValidation } from "@/validations/validations";

const Index = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("bg-gradient-custom");
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      loginValidation
        .validateAt(name, { [name]: value })
        .then(() => {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        })
        .catch((err) => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: err.message,
          }));
        });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));

    loginValidation
      .validateAt(name, { [name]: value })
      .then(() => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      })
      .catch((err) => {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: err.message,
        }));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginValidation.validate(formData, { abortEarly: false });
      setErrors({});
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
        formData
      );

      toast.success(response?.data?.message);
      console.log("res", response.data);
      Cookies.set("loggedInUser", JSON.stringify(response?.data), {
        expires: 30, // 30 days
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Protect against CSRF attacks
        path: "/", // Accessible throughout your site
      });
      localStorage.setItem("loggedInUser", JSON.stringify(response?.data));
      setLoading(false);
      console.log("user", response.data);
      // if system admin the check condition else check scopes
      if (response.data.user?.roleTitle === "System Admin") {
        if (response?.data?.user?.alreadyLoggedIn) {
          router.push("/dashboard");
        } else {
          router.push("/setup");
        }
      } else {
        const scopes = response?.data?.userRoles?.scopes;
        const allowedScope = scopes?.find((s) => s?.permissions?.viewAll);
        router.push(allowedScope?.page ? allowedScope?.page : "/dashboard");
      }
    } catch (err) {
      setLoading(false);

      if (err.response) {
        console.log("Server error:", err.response.data);
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
        {/* <div className="flex items-center justify-center mt-20 mb-10 h-1">
          <Animation path={logo} />
        </div> */}
        {/* <div className="flex items-center justify-start mx-8 mt-5 mb-5 h-11">
          <div className="text-4xl font-galada font-bold text-transparent bg-gradient-to-r from-[#3a9dbd] to-[#5bc1da] bg-clip-text animate-gradient mx-auto">
            SssManage
          </div>
          <div className="relative ml-3 flex-shrink-0 rounded-full w-2 h-2 bg-[#5bc1da] animate-ping"></div>
        </div> */}

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
          <FormHeading
            text="Sign in to your account"
            extra="text-white lg:text-black"
          />
          <form onSubmit={handleSubmit}>
            <InputField
              label="Email Or Phone"
              name="email"
              type="text"
              placeholder="example@gmail.com or +923472907283"
              value={formData.email}
              onChange={handleChange}
              // onBlur={handleBlur}
              error={errors.email}
              extra="text-white lg:text-black"
            />
            <InputField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              // onBlur={handleBlur}
              error={errors.password}
              extra="text-white lg:text-black"
            />

            <FormButton text="Sign In" loading={loading} />
          </form>
          <div className="mt-4 text-center w-[100%]">
            <Link
              href="/signup"
              className="text-white px-2 lg:px-0 lg:text-buttonColorPrimary  hover:underline">
              Want to create a new company ? Click here to Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
