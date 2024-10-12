import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  isSignup = false,
  extra,
}) => {
  return (
    <div className={isSignup ? `mb-2` : "my-8"}>
      <label htmlFor={name} className={`block ${extra} lg:text-gray-700`}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        placeholder={placeholder}
        className={`mt-1 block w-full p-2 border text-black ${
          error
            ? "border-red-500 focus:border-buttonColorPrimary focus:outline-none"
            : "border-gray-300 focus:border-buttonColorPrimary focus:outline-none"
        } rounded`}
      />
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </div>
  );
};

export default InputField;
