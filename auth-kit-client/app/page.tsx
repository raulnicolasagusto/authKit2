'use client';

import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";
import { useState } from "react";

export default function Home() {
  useRedirect("/login");
  const { user, logoutUser, handlerUserInput, userState, updateUser, loading } = useUserContext();
  const { name, photo, email, isVerified, bio } = user?.user || {};
  
  const [isOpen, setIsOpen] = useState(false);
  const [localBio, setLocalBio] = useState(bio || ""); // Estado local para el formulario
  
  const myToggle = () => {
    setIsOpen(!isOpen);
    // Resetear el valor del formulario al abrir/cerrar
    setLocalBio(bio || "");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const success = await updateUser({ bio: localBio });
      
      if (success) {
        toast.success("Bio updated successfully");
        setIsOpen(false);
      }
    } catch (error) {
      toast.error("Error updating bio");
      console.error("Update error:", error);
    }
  }

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
          <button 
            onClick={myToggle} 
            className="px-4 py-2 rounded-md bg-[#2ECC71] text-white mt-2"
            disabled={loading}
          >
            {isOpen ? 'Cancel Update' : 'Update Bio'}
          </button>
        </div>

        {/* Sección derecha - Botones y avatar */}
        <div className="flex items-center gap-4 self-end sm:self-center">
          <img
            src={photo}
            alt={name}
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
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

      {/* Formulario de Bio (aparece debajo del encabezado) */}
      {isOpen && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow-md w-full">
          <h2 className="text-xl font-semibold mb-4">Update Your Bio</h2>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className="mb-2 text-gray-600" htmlFor="bio">About You</label>
              <textarea
                name="bio"
                value={localBio}
                onChange={(e) => setLocalBio(e.target.value)}
                id="bio"
                cols={30}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Tell us about yourself..."
                disabled={loading}
              />
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={myToggle}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-md bg-[#2ECC71] text-white hover:bg-[#27ae60] transition"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}