import React, { useState } from "react";
import { addClient } from "@/validations/validations";
import InputField from "@/components/base/InputField";
import FormButton from "@/components/base/FormButton";
import Sidebar from "@/components/base/Sidebar";
import Breadcrumb from "@/components/base/Breadcrumb";
import AvatarUpload from "@/components/listing/AvatarUpload";
import Animation from "@/components/animations/Animation";
import circle from "../../../../public/circle.json";
import Head from "next/head";

import { checkScope } from "@/helpers/checkScope";

const Index = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyName: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [avatar, setAvatar] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (touched[name]) {
      addClient
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

    addClient
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
      await addClient.validate(formData, { abortEarly: false });
      setErrors({});
      // Handle sign-up logic here
      console.log("Form submitted:", formData);
    } catch (err) {
      const newErrors = {};
      err.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
    }
  };

  const breadcrumbItems = [
    { label: "Clients", href: "/client" },
    { label: "Add Client", href: null },
  ];

  return (
    <div className="flex overflow-hidden">
      <Sidebar currentPage="Manage Client" />
      <Head>
        <title>Add Client</title>
        <meta name="description" content="A simple custom form builder" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="lg:min-w-[77%] pb-20 lg:max-w-[82%] xl:min-w-[81%] xl:max-w-[81%] flex justify-between items-center bg-[#edf5fa]">
        <div className="p-8 w-full lg:w-2/4">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="text-2xl font-bold my-4">Add Client</h1>
          <div className="p-4 bg-white min-h-[80%]">
            <form onSubmit={handleSubmit} className="">
              <AvatarUpload avatar={avatar} setAvatar={setAvatar} />
              <InputField
                label="First Name"
                name="firstName"
                type="text"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.firstName}
              />
              <InputField
                label="Last Name"
                name="lastName"
                type="text"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.lastName}
              />
              <InputField
                label="Email"
                name="email"
                type="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
              />
              <InputField
                label="Company Name"
                name="companyName"
                type="text"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.companyName}
              />
              <FormButton text="Add Client" />
            </form>
          </div>
        </div>
        <div className="hidden lg:flex w-2/4 pt-10 justify-center items-center">
          <div className="w-full h-full flex justify-center items-center">
            {/* <Animation path={circle} /> */}
          </div>
        </div>
      </div>
    </div>
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

  if (!scopes) {
    return {
      notFound: true,
    };
  }
  // Pass the fetched data as props to the component
  return {
    props: { scopes, canEdit },
  };
};
