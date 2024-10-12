import React, { useState } from "react";

import Modal from "@/components/categories/GeneralModal";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const DeleteRecord = ({ isOpen, onClose, path, recordId, refreshList }) => {
  const handleDeleteRecord = async () => {
    try {
      const response = await apiClient.delete(`/${path}/${recordId}`);
      toast.success(response?.data?.message);

      await refreshList();
    } catch (err) {
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

export default DeleteRecord;
