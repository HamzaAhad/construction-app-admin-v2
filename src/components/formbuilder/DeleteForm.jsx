import React, { useState } from "react";

import Modal from "@/components/categories/DeleteForm.";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const DeleteForm = ({ isOpen, onClose, recordId, refreshList }) => {
  const handleDeleteRecord = async () => {
    try {
      const response = await apiClient.delete(`/forms/${recordId}`);
      toast.success(response?.data?.message);

      await refreshList();
    } catch (err) {
      console.log("Server error:", err?.response?.data);
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    }
    onClose(false);
  };
  return (
    <Modal
      onSave={handleDeleteRecord}
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Delete"
      bg="bg-red-500"
      title="Delete"
    >
      <div className=" py-4 text-black">
        Are you sure you want to delete this record ?
      </div>
    </Modal>
  );
};

export default DeleteForm;
