import React, { useState } from "react";

import Modal from "@/components/categories/GeneralModal";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const DeleteRecord = ({ isOpen, onClose, path, recordId, refreshList }) => {
  const [loading, setLoading] = useState(false);
  const handleDeleteRecord = async () => {
    try {
      setLoading(true);
      const response = await apiClient.delete(`/${path}/${recordId}`);
      toast.success(response?.data?.message);

      await refreshList();
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    } finally {
      setLoading(false);
      onClose(false);
    }
  };
  return (
    <Modal
      onSave={handleDeleteRecord}
      isOpen={isOpen}
      onClose={onClose}
      buttonText="Delete"
      bg="bg-red-500"
      title="Delete"
      loading={loading}>
      <div className=" py-4 text-black">
        Are you sure you want to delete this record ?
      </div>
    </Modal>
  );
};

export default DeleteRecord;
