import React, { useState } from "react";

import Modal from "./GeneralModal";
import InputField from "@/components/base/InputField";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const AddCategory = ({ isOpen, onClose, refreshList }) => {
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = async (e) => {
    const value = e.target.value;
    setCategoryName(value);
  };

  const handleAddCategory = async () => {
    if (categoryName === "") {
      setError("This field is required");
      return;
    }
    try {
      setLoading(true);
      const response = await apiClient.post("/folders", {
        title: categoryName,
      });
      toast.success(response?.data?.message);

      await refreshList();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    } finally {
      setLoading(false);
    }
    setCategoryName("");
    setError("");
    onClose(false);
  };
  return (
    <Modal
      onSave={handleAddCategory}
      isOpen={isOpen}
      onClose={onClose}
      onError={setError}
      buttonText="Add Category"
      bg="bg-buttonColorPrimary"
      title="Add Category"
      loading={loading}>
      <InputField
        label="Category Name"
        name="categoryName"
        type="text"
        placeholder="Enter category name"
        value={categoryName}
        onChange={handleChange}
        error={error}
      />
    </Modal>
  );
};

export default AddCategory;
