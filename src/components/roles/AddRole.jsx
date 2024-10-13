import React, { useState } from "react";

import Modal from "../categories/GeneralModal";
import InputField from "@/components/base/InputField";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const AddRole = ({ isOpen, onClose, refreshList }) => {
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = async (e) => {
    const value = e.target.value;
    setRole(value);
  };

  const handleAddRole = async () => {
    if (role === "") {
      setError("This field is required");
      return;
    }
    try {
      setLoading(true);
      const response = await apiClient.post("/roles", {
        title: role,
      });
      toast.success(response?.data?.message);
      onClose(false);
      setRole("");
      setError("");
      await refreshList();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
      setError("");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      onSave={handleAddRole}
      isOpen={isOpen}
      onClose={onClose}
      onError={setError}
      buttonText="Add Role"
      bg="bg-buttonColorPrimary"
      title="Add Role"
      loading={loading}>
      <InputField
        label="Role"
        name="role"
        type="text"
        placeholder="Enter role"
        value={role}
        onChange={handleChange}
        error={error}
      />
    </Modal>
  );
};

export default AddRole;
