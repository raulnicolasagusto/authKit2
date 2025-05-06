'use client';

import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  useRedirect("/login");
  const { 
    user, 
    logoutUser, 
    userState, 
    updateUser, 
    uploadPhoto, 
    loading 
  } = useUserContext();
  
  const { name, photo, email, isVerified, bio, role } = user?.user || {};
  const fileInputRef = useRef(null);
  
  // State for edit modes
  const [editMode, setEditMode] = useState({
    bio: false,
    name: false,
    email: false,
    password: false
  });
  
  // Local form states
  const [formData, setFormData] = useState({
    name: name || "",
    email: email || "",
    bio: bio || "",
    currentPassword: "",
    newPassword: ""
  });

  // Toggle edit mode
  const toggleEdit = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
    // Reset form data when opening edit
    if (!editMode[field]) {
      setFormData(prev => ({
        ...prev,
        [field]: user?.user?.[field] || "",
        currentPassword: "",
        newPassword: ""
      }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      await uploadPhoto(file);
      toast.success("Photo updated successfully");
    } catch (error) {
      toast.error("Error uploading photo");
    }
  };

  // Submit updates
  const handleSubmit = async (field, e) => {
    e.preventDefault();
    
    try {
      let dataToUpdate = {};
      
      if (field === 'password') {
        if (!formData.currentPassword || !formData.newPassword) {
          toast.error("Both password fields are required");
          return;
        }
        dataToUpdate = {
          currentPassword: formData.currentPassword,
          password: formData.newPassword
        };
      } else {
        dataToUpdate = { [field]: formData[field] };
      }
      
      const success = await updateUser(dataToUpdate);
      
      if (success) {
        toast.success("Changes saved successfully");
        setEditMode(prev => ({ ...prev, [field]: false }));
      }
    } catch (error) {
      toast.error("Error saving changes");
    }
  };

  return (
    <main className="py-[2rem] mx-[1rem] sm:mx-[10rem]">
      {/* Encabezado fijo - Igual al original */}
      <header className="flex flex-col sm:flex-row justify-between items-start sticky top-0 bg-white z-10 py-4 shadow-md">
        {/* Sección izquierda - Bienvenida */}
        <div className="flex flex-col items-start gap-2 mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold">
            Welcome <span className="text-red-600">{name}</span>
          </h1>
          <p className="text-gray-600">{bio || "I am a new user."}</p>
        </div>

        {/* Sección derecha - Botones y avatar */}
        <div className="flex items-center gap-4 self-end sm:self-center">
          <div className="relative">
            <img
              src={photo || "/default-avatar.jpg"}
              alt={name}
              className="w-[50px] h-[50px] rounded-full object-cover cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/*"
              className="hidden"
              disabled={loading}
            />
          </div>
          {!isVerified && (
            <button className="px-4 py-2 rounded-md bg-yellow-500 text-white">
              Verify Account
            </button>
          )}
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={logoutUser}
            disabled={loading}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Contenedor principal de edición - Estilo como el original de Bio */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

        {/* Campo Name */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Name</label>
          {!editMode.name ? (
            <div className="flex justify-between items-center">
              <p className="text-gray-800">{name}</p>
              <button
                onClick={() => toggleEdit('name')}
                className="px-4 py-2 rounded-md bg-[#2ECC71] text-white"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmit('name', e)}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => toggleEdit('name')}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#2ECC71] text-white hover:bg-[#27ae60] transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Campo Email */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Email</label>
          {!editMode.email ? (
            <div className="flex justify-between items-center">
              <p className="text-gray-800">{email}</p>
              <button
                onClick={() => toggleEdit('email')}
                className="px-4 py-2 rounded-md bg-[#2ECC71] text-white"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmit('email', e)}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => toggleEdit('email')}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#2ECC71] text-white hover:bg-[#27ae60] transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Campo Bio */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-600">About You</label>
          {!editMode.bio ? (
            <div className="flex justify-between items-center">
              <p className="text-gray-800">{bio || "No bio yet"}</p>
              <button
                onClick={() => toggleEdit('bio')}
                className="px-4 py-2 rounded-md bg-[#2ECC71] text-white"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmit('bio', e)}>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                rows={4}
                placeholder="Tell us about yourself..."
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => toggleEdit('bio')}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#2ECC71] text-white hover:bg-[#27ae60] transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Campo Password */}
        <div className="mb-6">
          <label className="block mb-2 text-gray-600">Password</label>
          {!editMode.password ? (
            <div className="flex justify-between items-center">
              <p className="text-gray-800">••••••••</p>
              <button
                onClick={() => toggleEdit('password')}
                className="px-4 py-2 rounded-md bg-[#2ECC71] text-white"
              >
                Change
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => handleSubmit('password', e)}>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleInputChange}
                placeholder="Current password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
                required
              />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                placeholder="New password"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
                required
              />
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => toggleEdit('password')}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-[#2ECC71] text-white hover:bg-[#27ae60] transition"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Información de Role (no editable) */}
        <div className="p-4 bg-gray-50 rounded">
          <h3 className="text-lg font-semibold mb-1">Account Type</h3>
          <p className="text-gray-600 capitalize">{role}</p>
        </div>
      </div>
    </main>
  );
}