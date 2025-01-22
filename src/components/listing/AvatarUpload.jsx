import React, { useState } from "react";

import { IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";

const AvatarUpload = ({
  avatar,
  setAvatar,
  label = "Add Avatar",
  widthHeight,
  setImageFile = () => {},
}) => {
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className={`${
              widthHeight ? widthHeight : "w-24 h-24 rounded-full"
            }  object-cover`}
          />
        ) : (
          <div
            className={`${
              widthHeight ? widthHeight : "w-24 h-24 rounded-full"
            } bg-gray-200  flex items-center justify-center`}>
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <input
          accept="image/*"
          id="avatar-upload"
          type="file"
          className="hidden"
          onChange={handleAvatarChange}
        />
        <label htmlFor="avatar-upload">
          <IconButton
            color="primary"
            aria-label="upload picture"
            component="span"
            className="absolute -bottom-2 -right-2">
            <PhotoCamera />
          </IconButton>
        </label>
      </div>
    </div>
  );
};

export default AvatarUpload;
