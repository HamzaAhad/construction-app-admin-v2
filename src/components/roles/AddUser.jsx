import React, { use, useEffect, useState } from "react";

import Modal from "../categories/GeneralModal";

import apiClient from "@/helpers/interceptor";
import { toast } from "react-toastify";

const AddUser = ({ isOpen, onClose, refreshList, id }) => {
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleId, setRoleId] = useState("");
  const [roleTitle, setRoleTitle] = useState("");

  const fetchRole = async () => {
    try {
      const response = await apiClient.get(`roles/${id}`);
      setRoleId(response.data.result.id);
      setRoleTitle(response.data.result.title);
    } catch (err) {
      console.log("err", err);
    }
  };
  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/users");
      setUsers(response.data); // Assuming response.data contains the user list
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      fetchRole();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!selectedUser) {
      setError("Please select a user.");
      return;
    }
    console.log("handleSubmit");
    try {
      // Call the PUT API to associate the user with the role
      await apiClient.put(`/users/${selectedUser.id}`, { roleId, roleTitle });
      await refreshList(); // Refresh the user list
      toast.success("User added successfully!");
      onClose(false); // Close the modal
    } catch (err) {
      toast.error(err?.response?.data?.message || err?.response?.data?.error);
    }
    setError("");
  };

  return (
    <Modal
      onSave={handleSubmit}
      isOpen={isOpen}
      onClose={onClose}
      onError={setError}
      buttonText="Add User"
      bg="bg-buttonColorPrimary"
      title="Associate User">
      <div>
        <label className="block mb-2 text-black">Select User</label>
        <select
          className="border text-black rounded-md p-2 w-full"
          value={selectedUser ? selectedUser.id : ""}
          onChange={(e) => {
            const user = users.find((u) => u.id == e.target.value);
            setSelectedUser(user);
          }}>
          <option className="text-black" value="" disabled>
            Select a user
          </option>
          {users.map((user) => (
            <option className="text-black" key={user.id} value={user.id}>
              {`${user.firstName} ${user.lastName}`}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500">{error}</p>}
      </div>
      {/* Add additional inputs for roleId and roleTitle if necessary */}
    </Modal>
  );
};

export default AddUser;
