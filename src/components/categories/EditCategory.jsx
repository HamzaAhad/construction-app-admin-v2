import React, { useState, useEffect } from "react";

import Modal from "./GeneralModal";
import InputField from "@/components/base/InputField";

const EditCategory = ({ isOpen, onClose, category }) => {
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const [error, setError] = useState("");

  const handleChange = async (e) => {
    const value = e.target.value;
    setCategoryName(value);
  };

  const handleEditCategory = async () => {
    if (categoryName === "") {
      setError("This field is required");
    } else {
      onClose(false);
      setCategoryName("");
      setError("");
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onError={setError}
      onSave={handleEditCategory}
      buttonText="Edit Category"
      bg="bg-buttonColorPrimary"
      title="Edit Category">
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

export default EditCategory;
