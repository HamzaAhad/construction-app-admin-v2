import apiClient from "@/helpers/interceptor";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Menu,
  MenuItem,
  Button,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

const ProfileEdit = () => {
  // Retrieve logged-in user from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const { id, firstName, lastName, email, phone, avatar } =
    loggedInUser?.user || {};
  const name = `${firstName} ${lastName}`;
  const scopes = loggedInUser.userRoles.scopes;
  // State for updating profile
  const [profile, setProfile] = useState({ firstName, lastName, email, phone });
  const [avatarPreview, setAvatarPreview] = useState(
    avatar || "https://via.placeholder.com/150"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    // Ensure either email or phone is provided
    if (!profile.email && !profile.phone) {
      return toast.error(
        "Either email or phone is required to update the profile."
      );
    }

    // Prepare the form data
    let body;
    body = {
      firstName: profile.firstName,
      lastName: profile.lastName,
    };
    if (profile.email) {
      body = { ...body, email: profile.email };
    }
    if (profile.phone) {
      body = { ...body, phone: profile.phone };
    }
    console.log("body", body);
    try {
      const response = await apiClient.put(`/users/${id}`, body);
      console.log("response", response);
      if (response?.data?.user) {
        toast.success("Profile updated successfully.");
        const localData = { ...loggedInUser, user: response?.data?.user };
        console.log("localdata", localData);
        localStorage.setItem("loggedInUser", JSON.stringify(localData));
      } else {
        toast.error(response.data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      return toast.error("Both old password and new password are required.");
    }

    try {
      const body = {
        isPasswordField: true,
        oldPassword,
        newPassword,
      };
      const response = await apiClient.put(`/users/${id}`, body);

      if (response) {
        toast.success("Password updated successfully.");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(response?.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
    }
  };

  console.log("scopes", scopes);
  return (
    <div className="w-[400px] p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-6">My Profile</h2>

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        {/* <AvatarUpload avatar={avatarFile} setAvatar={setAvatarFile} /> */}
        {/* <div className="flex flex-col items-center mb-4">
          <img
            src={avatarPreview}
            alt="Profile Avatar"
            className="w-40 h-40 object-cover rounded-full mb-3"
          />
          <label className="text-sm text-gray-500 mb-2 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            Change Avatar
          </label>
        </div> */}
        <div className="flex justify-between">
          <input
            type="text"
            name="firstName"
            value={profile.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full p-2 border rounded-md mb-3"
          />
          <input
            type="text"
            name="lastName"
            value={profile.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full p-2 border rounded-md mb-3"
          />
        </div>
        <input
          type="email"
          name="email"
          value={profile.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full p-2 border rounded-md mb-3"
        />
        <input
          type="text"
          name="phone"
          value={profile.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          className="w-full p-2 border rounded-md mb-3"
        />
        <button
          onClick={handleUpdateProfile}
          className="w-full bg-buttonColorPrimary text-white py-2 rounded-md hover:bg-blue-400 transition">
          Update Profile
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old Password"
          className="w-full p-2 border rounded-md mb-3"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="w-full p-2 border rounded-md mb-3"
        />
        <button
          onClick={handleChangePassword}
          className="w-full bg-buttonColorPrimary text-gray-200 py-2 rounded-md hover:bg-blue-400 transition">
          Change Password
        </button>
      </div>
      <div className="mt-6 w-full">
        <h3 className="text-lg font-semibold mb-4">Permission</h3>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenMenu}
          style={{ width: "100%" }} // Ensures button takes full width of parent
        >
          View Permissions
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          PaperProps={{
            style: {
              width: anchorEl?.offsetWidth || "auto", // Matches the width of the button
              maxHeight: 200,
            },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}>
          {scopes?.map((scope, index) => (
            <MenuItem key={index}>
              <ListItemText primary={scope?.title} />
              <div className="flex items-center space-x-2">
                {scope?.permissions?.viewAll && (
                  <ListItemIcon>
                    <VisibilityIcon />
                  </ListItemIcon>
                )}
                {scope?.permissions?.editAll && (
                  <ListItemIcon>
                    <EditIcon />
                  </ListItemIcon>
                )}
              </div>
            </MenuItem>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default ProfileEdit;
