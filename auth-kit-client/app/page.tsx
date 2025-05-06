'use client';

import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";
import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  useRedirect("/login");
  const { 
    user, 
    logoutUser, 
    handlerUserInput, 
    userState, 
    updateUser, 
    uploadPhoto, 
    loading,
    allUsers,
    deleteUser,
    fetchAllUsers
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

  // State for delete confirmation
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Load users when component mounts and user is admin/creator
  useEffect(() => {
    if (role === 'admin' || role === 'creator') {
      fetchAllUsers();
    }
  }, [role, fetchAllUsers]);

  // Toggle edit mode
  const toggleEdit = (field) => {
    setEditMode(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
    
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
        toast.error("Ambos campos de contraseña son requeridos");
        return;
      }
      if (formData.newPassword.length < 6) {
        toast.error("La nueva contraseña debe tener al menos 6 caracteres");
        return;
      }
      dataToUpdate = {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      };
    } else {
      dataToUpdate = { [field]: formData[field] };
    }
    
    const success = await updateUser(dataToUpdate);
    
    if (success) {
      toast.success("¡Contraseña actualizada correctamente!");
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: ""
      }));
      setEditMode(prev => ({ ...prev, [field]: false }));
    }
  } catch (error) {
    toast.error(error.message || "Error al actualizar la contraseña");
  }
};

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (confirmDelete === userId) {
      const success = await deleteUser(userId);
      if (success) {
        setConfirmDelete(null);
      }
    } else {
      setConfirmDelete(userId);
    }
  };

  return (
    <main className="py-[2rem] mx-[1rem] sm:mx-[10rem]">
      {/* Encabezado fijo */}
      <header className="flex flex-col sm:flex-row justify-between items-start sticky top-0 bg-white z-10 py-4 shadow-md">
        {/* Sección izquierda - Bienvenida y bio */}
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

      {/* Contenedor principal de edición */}
    
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md w-full">
        <h2 className="text-xl font-semibold mb-4">Update Your Profile</h2>
        
        {/* Name Field */}
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

        {/* Email Field */}
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
{/* Bio Field - Nueva sección agregada */}
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

        {/* Password Field */}
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
      </div>

      {/* Panel de Administración (solo para admin/creator) */}
      {(role === 'admin' || role === 'creator') && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-6">User Management</h2>
          
          {allUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PHOTO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROLE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {allUsers.map((userItem) => (
                    <tr key={userItem._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={userItem.photo || "/default-avatar.jpg"}
                          alt={userItem.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{userItem.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{userItem.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{userItem.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {confirmDelete === userItem._id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Are you sure?</span>
                            <button
                              onClick={() => handleDeleteUser(userItem._id)}
                              className="px-3 py-1 bg-red-600 text-white rounded-md text-xs"
                              disabled={loading}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-xs"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(userItem._id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-md text-xs"
                            disabled={loading || userItem._id === user?.user?._id}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {loading ? 'Loading users...' : 'No users found'}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

//TERMINAMOS MIN 4:30:01 DEL TOTAL DE 05:55:27 . EL FINAL DEL VIDEO ES DE EMAIL VERIFICATION Y NO TENEMOS IMPLEMENTADO TODAVIA ESTO.
// VIDEO YOUTUBE : https://www.youtube.com/watch?v=ilHWU2SJ8LM&t=11975s