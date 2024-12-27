// import React, { useState } from "react";

// const ProfileEdit = () => {
//   // Retrieve logged-in user from localStorage
//   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
//   const { firstName, lastName, email, phone, avatar } = loggedInUser?.user;
//   const name = `${firstName} ${lastName}`;
//   // State for updating profile
//   const [profile, setProfile] = useState({ name: name, email, phone });
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfile((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleUpdateProfile = () => {
//     console.log("Profile updated:", profile);
//     // Call an API to update profile or handle the update logic
//   };

//   const handleChangePassword = () => {
//     console.log("Password changed:", { oldPassword, newPassword });
//     // Call an API to change the password
//   };
//   console.log("logged In user", loggedInUser);
//   console.log("profile", profile);
//   return (
//     <div className="w-[400px] p-6 bg-white shadow-md rounded-md">
//       <h2 className="text-xl font-semibold mb-6">Profile Details</h2>

//       <div className="mb-4">
//         <img
//           src={avatar || "https://via.placeholder.com/150"}
//           alt="Profile Avatar"
//           className="w-20 h-20 rounded-full mx-auto mb-4"
//         />
//         <input
//           type="text"
//           name="name"
//           value={profile.name}
//           onChange={handleInputChange}
//           placeholder="Name"
//           className="w-full p-2 border rounded-md mb-3"
//         />
//         <input
//           type="email"
//           name="email"
//           value={profile.email}
//           onChange={handleInputChange}
//           placeholder="Email"
//           className="w-full p-2 border rounded-md mb-3"
//         />
//         <input
//           type="text"
//           name="phone"
//           value={profile.phone}
//           onChange={handleInputChange}
//           placeholder="Phone"
//           className="w-full p-2 border rounded-md mb-3"
//         />
//         <button
//           onClick={handleUpdateProfile}
//           className="w-full bg-buttonColorPrimary text-white py-2 rounded-md hover:bg-blue-600 transition">
//           Update Profile
//         </button>
//       </div>

//       <div className="mt-6">
//         <h3 className="text-lg font-semibold mb-4">Change Password</h3>
//         <input
//           type="password"
//           value={oldPassword}
//           onChange={(e) => setOldPassword(e.target.value)}
//           placeholder="Old Password"
//           className="w-full p-2 border rounded-md mb-3"
//         />
//         <input
//           type="password"
//           value={newPassword}
//           onChange={(e) => setNewPassword(e.target.value)}
//           placeholder="New Password"
//           className="w-full p-2 border rounded-md mb-3"
//         />
//         <button
//           onClick={handleChangePassword}
//           className="w-full bg-blue-300 text-gray-200 py-2 rounded-md hover:bg-blue-200 transition">
//           Change Password
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProfileEdit;

import React, { useState } from "react";

const ProfileEdit = () => {
  // Retrieve logged-in user from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
  const { firstName, lastName, email, phone, avatar } =
    loggedInUser?.user || {};
  const name = `${firstName} ${lastName}`;

  // State for updating profile
  const [profile, setProfile] = useState({ name, email, phone });
  const [avatarPreview, setAvatarPreview] = useState(
    avatar || "https://via.placeholder.com/150"
  );
  const [avatarFile, setAvatarFile] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

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

  const handleUpdateProfile = () => {
    console.log("Profile updated:", { ...profile, avatarFile });
    // Call an API to update profile and upload avatar
  };

  const handleChangePassword = () => {
    console.log("Password changed:", { oldPassword, newPassword });
    // Call an API to change the password
  };

  return (
    <div className="w-[400px] p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-semibold mb-6">Profile Details</h2>

      <div className="mb-4">
        <div className="flex flex-col items-center mb-4">
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
        </div>
        <input
          type="text"
          name="name"
          value={profile.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="w-full p-2 border rounded-md mb-3"
        />
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
    </div>
  );
};

export default ProfileEdit;
