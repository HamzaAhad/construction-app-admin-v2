import React, { useState, useEffect } from "react";

import Modal from "@/components/categories/GeneralModal";
import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const EditEmployeeModal = ({ isOpen, onClose, userData }) => {
  const [roles, setRoles] = useState([]);
  const getRoles = async () => {
    try {
      const response = await apiClient.get("/roles");
      setRoles(response.data);
    } catch (error) {
      console.log("error", err);
    }
  };
  console.log("roles", roles);
  useEffect(() => {
    getRoles();
  }, []);
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    roleTitle: userData.roleTitle || "",
  });
  console.log("userId", userData);
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    // if (!formData.email) {
    //   newErrors.email = "Email is required";
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = "Invalid email format";
    // }
    if (formData.email !== "") {
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
    }
    if (formData.phone !== "") {
      if (!/^\+?\d{10,15}$/.test(formData.phone)) {
        newErrors.phone = "Invalid phone format";
      }
    }
    // if (!formData.phone) {
    //   newErrors.phone = "Phone is required";
    // } else if (!/^\+?\d{10,15}$/.test(formData.phone)) {
    //   newErrors.phone = "Invalid phone format";
    // }
    if (!formData.roleTitle) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        roleTitle: userData.roleTitle || "",
      });
    }
  }, [userData]);

  // Form submission handler
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const role = roles.find((item) => item.title === formData.roleTitle);
        let body = { ...formData };
        body.roleId = role.id;

        const result = await apiClient.put(`/users/${userData?.id}`, body);
        if (result) {
          toast.success("User updated successfully");
        }
      } catch (err) {
        console.log("err", err);
      } finally {
        onClose();
      }
    }
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      //   onError={setError}
      onSave={handleSubmit}
      buttonText="Edit"
      bg="bg-buttonColorPrimary"
      title="Edit Employee">
      <form>
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            disabled={!!userData.email} // Disable if email exists
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            disabled={!!userData.phone} // Disable if phone exists
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Role</label>
          <select
            name="roleTitle"
            value={formData.roleTitle}
            onChange={handleChange}
            className="w-full border p-2 rounded">
            <option value="">Select Role</option>
            {roles.map(
              (role) =>
                role.scopes && (
                  <option
                    key={role.id}
                    value={role.name}
                    className="text-black">
                    {role.title}
                  </option>
                )
            )}
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>
      </form>
    </Modal>
  );
};

export default EditEmployeeModal;
