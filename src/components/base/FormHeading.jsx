import React from "react";

const FormHeading = ({ text, extra }) => {
  return (
    <h2 className={`text-2xl lg:text-3xl font-bold mb-6 ${extra}`}>{text}</h2>
  );
};

export default FormHeading;
