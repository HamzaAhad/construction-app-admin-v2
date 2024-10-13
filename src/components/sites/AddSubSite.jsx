import React, { useState } from "react";

import InputField from "@/components/base/InputField";
import Modal from "@/components/categories/GeneralModal";
import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const AddSubSite = ({ isOpen, onClose, refreshList, siteId }) => {
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
      const response = await apiClient.post(`/sub-sites/${siteId}/site`, {
        name: categoryName,
      });
      toast.success(response?.data?.message);

      await refreshList();
    } catch (err) {
      console.log("Server error:", err?.response?.data);
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    } finally {
      setLoading(false);
      setCategoryName("");
      setError("");
      onClose(false);
    }
  };

  return (
    <Modal
      onSave={handleAddCategory}
      isOpen={isOpen}
      onClose={onClose}
      onError={setError}
      buttonText="Add Sub Site"
      bg="bg-buttonColorPrimary"
      title="Add Sub SIte"
      loading={loading}>
      <InputField
        label="Sub Site Name"
        name="categoryName"
        type="text"
        placeholder="Enter sub site name"
        value={categoryName}
        onChange={handleChange}
        error={error}
      />
    </Modal>
  );
};

export default AddSubSite;
