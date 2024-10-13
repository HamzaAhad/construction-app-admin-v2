import React, { useState } from "react";

import Modal from "./GeneralModal";
import InputField from "@/components/base/InputField";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const AddFormComponent = ({
  isOpen,
  onClose,
  name,
  setName,
  onSubmit,
  loading,
}) => {
  const [error, setError] = useState("");
  const handleChange = async (e) => {
    const value = e.target.value;
    setName(value);
  };

  return (
    <Modal
      onSave={onSubmit}
      isOpen={isOpen}
      onClose={onClose}
      onError={setError}
      buttonText="Add Component"
      bg="bg-buttonColorPrimary"
      title="Add Form Component"
      loading={loading}>
      <InputField
        label="Component Name"
        name="name"
        type="text"
        placeholder="Enter component name"
        value={name}
        onChange={handleChange}
        error={error}
      />
    </Modal>
  );
};

export default AddFormComponent;
