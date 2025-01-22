import apiClient from "@/helpers/interceptor";
import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { useRouter } from "next/router";

const ProfileEdit = () => {
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const { id, firstName, lastName, email, phone, avatar, roleTitle } =
    loggedInUser?.user || {};
  const companyId = loggedInUser?.comapany?.id;
  const companyName = loggedInUser?.comapany?.name;
  const companyLogo = loggedInUser?.comapany?.logo;
  const [companyInfo, setCompanyInfo] = useState({
    companyName: companyName || "",
    companyLogoPreview: companyLogo || "https://via.placeholder.com/150",
    companyLogoFile: null,
  });

  useEffect(() => {
    setCompanyInfo({
      companyName: companyName || "",
      companyLogoPreview: companyLogo || "https://via.placeholder.com/150",
      companyLogoFile: null,
    });
  }, [companyName, companyLogo]);
  const name = `${firstName} ${lastName}`;
  const scopes = loggedInUser.userRoles?.scopes;
  const [profile, setProfile] = useState({ firstName, lastName, email, phone });
  const [avatarPreview, setAvatarPreview] = useState(
    avatar || "https://via.placeholder.com/150"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleCompanyInfoChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo((prev) => ({ ...prev, [name]: value }));
  };
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
    try {
      const response = await apiClient.put(`/users/${id}`, body);
      if (response?.data?.user) {
        toast.success("Profile updated successfully.");
        const localData = { ...loggedInUser, user: response?.data?.user };
        localStorage.setItem("loggedInUser", JSON.stringify(localData));
      } else {
        toast.error(response.data.error || "Failed to update profile.");
      }
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  const router = useRouter();
  const handleUpdateCompanyInfo = async () => {
    if (!companyInfo.companyName) {
      return toast.error("Company name is required.");
    }
    let logoUrl = companyInfo?.companyLogoPreview;
    if (companyInfo?.companyLogoFile) {
      const formData = new FormData();
      formData.append("file", companyInfo?.companyLogoFile);
      const { accessToken } = loggedInUser;
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        logoUrl = response?.data?.fileName;
      } catch (error) {
        console.log("error", error);
      }
    }
    const body = {
      name: companyInfo?.companyName,
      logo: logoUrl,
    };
    try {
      const response = await apiClient.put(`/users/update-company`, body);
      if (response?.data) {
        if (response?.data) {
          const loggedInUser =
            JSON.parse(localStorage.getItem("loggedInUser")) || {};
          loggedInUser.comapany = response?.data; // Update only the company property
          localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
        }

        toast.success("Company information updated successfully.");
        if (window != undefined) {
          window.location.reload();
        }
      } else {
        toast.error(response.data.error || "Failed to update company info.");
      }
    } catch (error) {
      console.error("Error updating company info:", error);
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

  const handleCompanyLogoChange = (e) => {
    const file = e?.target?.files?.[0]; // Safely access the selected file
    if (file) {
      const validFormats = ["image/jpeg", "image/png", "image/svg+xml"]; // Allowed formats
      if (!validFormats.includes(file.type)) {
        toast.error(
          "Invalid file format. Please upload a JPEG, PNG, or SVG image."
        );
        return;
      }

      setCompanyInfo((prev) => ({
        ...prev,
        companyLogoFile: file,
        companyLogoPreview: URL.createObjectURL(file), // Generate a preview URL
      }));
    } else {
      // Reset to original logo
      setCompanyInfo((prev) => ({
        ...prev,
        companyLogoPreview: companyLogo,
        companyLogoFile: null,
      }));
    }
  };

  return (
    <div className="w-[400px] p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-6">My Profile</h2>

      {roleTitle === "System Admin" && (
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-semibold mb-4">Company Information</h3>
          <input
            type="text"
            name="companyName"
            value={companyInfo.companyName}
            onChange={handleCompanyInfoChange}
            placeholder="Company Name"
            className="w-full p-2 border rounded-md mb-3"
          />
          <div className="flex items-center mb-4 gap-4">
            <div className="relative w-20 h-20 flex-shrink-0">
              <img
                src={
                  companyInfo.companyLogoFile
                    ? companyInfo.companyLogoPreview
                    : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${companyInfo.companyLogoPreview}`
                }
                alt="Company Logo"
                className="w-full h-full object-cover border rounded-md shadow-md"
              />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload New Logo
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCompanyLogoChange}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="mt-2 flex items-center gap-4">
                <p className="text-sm text-gray-500">
                  Accepted formats: JPEG, PNG, SVG.
                </p>
                {companyInfo.companyLogoFile && (
                  <button
                    onClick={() => handleCompanyLogoChange(null)} // Reset to original logo
                    className="text-sm text-red-500 underline hover:text-red-700">
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={handleUpdateCompanyInfo}
            className="w-full bg-buttonColorPrimary text-white py-2 rounded-md hover:bg-blue-400 transition">
            Update Company Information
          </button>
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
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
          className="bg-buttonColorPrimary"
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
