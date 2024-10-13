import React, { useState } from "react";
import { useRouter } from "next/router";

import Modal from "@/components/categories/GeneralModal";
import InputField from "@/components/base/InputField";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const AddForm = ({ isOpen, onClose, refreshList }) => {
  const router = useRouter();
  const { categoryId } = router.query;
  const [error, setError] = useState("");
  const [formName, setFormName] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = async (e) => {
    const value = e.target.value;
    setFormName(value);
  };

  const handleAddForm = async () => {
    if (formName === "") {
      setError("This field is required");
      return;
    }
    try {
      setLoading(true);
      const response = await apiClient.post(`/forms/${categoryId}/folder`, {
        title: formName,
      });
      toast.success(response?.data?.message);

      await refreshList();
    } catch (err) {
      console.log("Server error:", err?.response?.data);
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    } finally {
      setLoading(false);
      setFormName("");
      setError("");
      onClose(false);
    }
  };
  return (
    <Modal
      onSave={handleAddForm}
      isOpen={isOpen}
      onClose={onClose}
      onError={setError}
      buttonText="Add Form"
      bg="bg-buttonColorPrimary"
      title="Add Form"
      loading={loading}>
      <InputField
        label="Form Name"
        name="FormName"
        type="text"
        placeholder="Enter form name"
        value={formName}
        onChange={handleChange}
        error={error}
      />
    </Modal>
  );
};

export default AddForm;
