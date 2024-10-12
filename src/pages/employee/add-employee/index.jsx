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

const Index = ({ scopes }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setErrors({});
      setLoading(true);
      if (formData.phone === "") {
        delete formData.phone;
      }
      if (formData.email === "") {
        delete formData.email;
      }
      console.log("formData--->", formData);
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

  return (
    <PageContainer
      scopes={scopes}
      title="Add Employee"
      currentPage="Manage Employee"
    >
      <div className="p-2 py-20 lg:p-8 w-full lg:w-1/2">
        <div className="bg-white p-6 shadow-lg rounded-md">
          <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb here */}
          <h1 className="text-2xl font-bold my-4">Add Employee</h1>
          <form onSubmit={handleSubmit}>
            <AvatarUpload avatar={avatar} setAvatar={setAvatar} />
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
