import React, { useState } from "react";

import { useRouter } from "next/router";

import InputField from "@/components/base/InputField";
import FormButton from "@/components/base/FormButton";
import Breadcrumb from "@/components/base/Breadcrumb";
import AvatarUpload from "@/components/listing/AvatarUpload";
import PageContainer from "@/components/base/PageContainer";

import { addEmployee } from "@/validations/validations";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

import { checkScope } from "@/helpers/checkScope";
import { generateRandomPassword } from "@/helpers/generatePassword";
import axios from "axios";

const Index = ({ scopes }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [passwordGenerated, setPasswordGenerated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const handleGeneratePassword = (e) => {
    e.preventDefault();
    setPasswordError(false);
    setGenerating(true);
    setPasswordGenerated(true);
    const password = generateRandomPassword(10);
    console.log("password", password);
    setFormData((prev) => ({
      ...prev, // Keep all previous form data
      password: password, // Update only the password field
    }));
    setGenerating(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      addEmployee
        .validateAt(name, { [name]: value })
        .then(() => {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
        })
        .catch((err) => {
          setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
        });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));

    addEmployee
      .validateAt(name, { [name]: value })
      .then(() => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      })
      .catch((err) => {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: err.message }));
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addEmployee.validate(formData, { abortEarly: false });
      if (!passwordGenerated) {
        setPasswordError(true);
        return;
      }

      setErrors({});
      setLoading(true);
      if (formData.phone === "") {
        delete formData.phone;
      }
      if (formData.email === "") {
        delete formData.email;
      }
      let imgUrl;
      if (imageFile) {
        const formData = new FormData();
        try {
          if (window != undefined) {
            const { accessToken } = JSON.parse(
              localStorage.getItem("loggedInUser")
            );
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

            imgUrl = response?.data?.fileName;
          }
        } catch (error) {
          console.log("error", error);
        }
      }
      const response = await apiClient.post("/users", formData);

      toast.success(response?.data?.message);
      router.push("/employee");
      // Handle sign-up logic here
      console.log("Form submitted:", formData);
    } catch (err) {
      if (err.response) {
        console.log("Server error:", err.response.data);
        toast.error(err.response.data.message || err.response.data.error);
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

  const breadcrumbItems = [
    { label: "Employees", href: "/employee" },
    { label: "Add Employee", href: null }, // Current page, no link
  ];

  console.log("form data", formData);
  return (
    <PageContainer
      scopes={scopes}
      title="Add Employee"
      currentPage="Manage Employee">
      <div className="p-2 py-20 lg:p-8 w-full lg:w-2/3 xl:w-1/2">
        <div className="bg-white p-6 shadow-lg rounded-md">
          <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb here */}
          <h1 className="text-2xl font-bold my-4">Add Employee</h1>
          <form onSubmit={handleSubmit}>
            {/* <AvatarUpload
              avatar={avatar}
              setAvatar={setAvatar}
              setImageFile={setImageFile}
            /> */}
            <InputField
              label="First Name"
              name="firstName"
              type="text"
              placeholder="Enter your first name"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.firstName}
            />
            <InputField
              label="Last Name"
              name="lastName"
              type="text"
              placeholder="Enter your last name"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.lastName}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.email}
            />
            <InputField
              label="Phone Number"
              name="phone"
              type="text"
              placeholder="eg: +923472907283"
              value={formData.phone}
              onChange={handleChange}
              onBlur={() => {}}
              error={errors.phone}
            />
            <div className="flex flex-col justify-start items-start my-8">
              <label htmlFor="password" className="block lg:text-gray-700 mb-1">
                Password
              </label>
              <div className="flex justify-between w-full">
                <input
                  label="Password"
                  name="password"
                  type="text"
                  placeholder="Generate password"
                  value={formData.password}
                  disabled={true}
                  onChange={() => {}}
                  onBlur={() => {}}
                  className={`w-[48%] border text-black ${
                    passwordError
                      ? "border-red-500 focus:border-buttonColorPrimary focus:outline-none"
                      : "border-gray-300 focus:border-buttonColorPrimary focus:outline-none"
                  } rounded p-2 text-lg`}
                />
                <button
                  onClick={(e) => handleGeneratePassword(e)}
                  className="w-[48%] bg-buttonColorPrimary text-lg font-bold text-white p-2 rounded hover:bg-buttonColorPrimary transform transition-transform duration-500 ease-in-out hover:bg-blue-600">
                  {generating ? (
                    <span className="inline-block w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  ) : (
                    "Generate password"
                  )}
                </button>
              </div>
              {passwordError && (
                <div className="text-red-500 text-xs mt-1">
                  Password is required
                </div>
              )}
            </div>
            <FormButton text="Add Employee" loading={loading} />
          </form>
        </div>
      </div>
    </PageContainer>
  );
};

export default Index;

export const getServerSideProps = async (context) => {
  let {
    req: {
      cookies: { loggedInUser },
    },
    resolvedUrl,
  } = context;

  const { scopes, canEdit } = await checkScope(loggedInUser, resolvedUrl);

  if (!scopes || !canEdit) {
    return {
      notFound: true,
    };
  }
  // Pass the fetched data as props to the component
  return {
    props: { scopes, canEdit },
  };
};
