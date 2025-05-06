'use client';
import React, { createContext, useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const serverUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const router = useRouter();
 
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
        bio: "",
        photo: ""
    });
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);

    // Register user
    const registerUser = async (e) => {
        e.preventDefault();
        if (!userState.name || !userState.email.includes("@") || !userState.password || userState.password.length < 6) {
            toast.error("Por favor complete todos los campos correctamente (mínimo 6 caracteres)");
            return;
        }
        try {
            const response = await axios.post(`${serverUrl}/api/v1/register`, userState);
            toast.success("Usuario registrado exitosamente");
            setUserState({ name: "", email: "", password: "" });
            router.push("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al registrar usuario");
            console.error("Registration error:", error);
        }
    };

    // Login user
    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverUrl}/api/v1/login`, {
                email: userState.email,
                password: userState.password,
            }, { withCredentials: true });
            
            toast.success("Inicio de sesión exitoso");
            setUserState({ email: "", password: "" });
            await getUser();
            router.push("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Usuario o contraseña incorrectos");
            console.error("Login error:", error);
        }
    };

    // Check login status
    const userLoginStatus = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/v1/login_status`, { 
                withCredentials: true 
            });
            return !!res.data;
        } catch (error) {
            console.error("Login status error:", error);
            return false;
        }
    };

    // Logout user
    const logoutUser = async () => {
        try {
            await axios.get(`${serverUrl}/api/v1/logout`, { withCredentials: true });
            toast.success("Sesión cerrada correctamente");
            setUser(null);
            setInitialized(false);
            router.push("/login");
        } catch (error) {
            toast.error("Error al cerrar sesión");
            console.error("Logout error:", error);
        }
    };

    // Get user details
    const getUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/v1/user`, { 
                withCredentials: true 
            });
            setUser(res.data);
            setUserState(prev => ({
                ...prev,
                name: res.data.user?.name || "",
                email: res.data.user?.email || "",
                bio: res.data.user?.bio || "",
                photo: res.data.user?.photo || ""
            }));
        } catch (error) {
            toast.error("Error al obtener datos del usuario");
            console.error("Get user error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Update user
    const updateUser = async (data) => {
        setLoading(true);
        try {
          const response = await axios.patch(`${serverUrl}/api/v1/user`, data, {
            withCredentials: true
          });
      
          if (response.data.requiresRelogin) {
            // Forzar recarga completa para limpiar estados
            window.location.href = '/login';
            toast.success(response.data.message);
            return true;
          }
      
          // Actualizar estado del usuario
          setUser(prev => ({
            ...prev,
            user: { ...prev.user, ...response.data.user }
          }));
      
          toast.success("Datos actualizados correctamente");
          return true;
        } catch (error) {
          toast.error(error.response?.data?.message || "Error al actualizar");
          return false;
        } finally {
          setLoading(false);
        }
      };
    // Upload photo
    const uploadPhoto = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('photo', file);
            
            const res = await axios.patch(`${serverUrl}/api/v1/user/photo`, formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            setUser(prev => ({
                ...prev,
                user: { ...prev.user, photo: res.data.photo }
            }));
            
            toast.success("Foto actualizada correctamente");
            return res.data.photo;
        } catch (error) {
            toast.error("Error al subir la foto");
            console.error("Upload error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Get all users (admin/creator only)
    const fetchAllUsers = async () => {
        try {
            const endpoint = user?.user?.role === 'admin' 
                ? `${serverUrl}/api/v1/users` 
                : `${serverUrl}/api/v1/creator/users`;
            
            const res = await axios.get(endpoint, { 
                withCredentials: true 
            });
            setAllUsers(res.data.users);
        } catch (error) {
            toast.error("Error al obtener lista de usuarios");
            console.error("Fetch users error:", error);
        }
    };

    // Delete user (admin only)
    const deleteUser = async (userId) => {
        try {
            if (userId === user?.user?._id) {
                toast.error("No puedes eliminarte a ti mismo");
                return false;
            }

            await axios.delete(`${serverUrl}/api/v1/users/${userId}`, { 
                withCredentials: true 
            });
            
            await fetchAllUsers();
            toast.success("Usuario eliminado correctamente");
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al eliminar usuario");
            console.error("Delete error:", error);
            return false;
        }
    };

    // Form input handler
    const handlerUserInput = (name) => (e) => {
        const value = e.target.value;
        setUserState(prev => ({ ...prev, [name]: value }));
    };

    // Initialize auth state
    useEffect(() => {
        if (!initialized) {
            const initializeAuth = async () => {
                const isLoggedIn = await userLoginStatus();
                if (isLoggedIn) {
                    await getUser();
                    if (user?.user?.role === 'admin' || user?.user?.role === 'creator') {
                        await fetchAllUsers();
                    }
                } else {
                    setUser(null);
                }
                setInitialized(true);
            };
            initializeAuth();
        }
    }, [initialized]);

    return (
        <UserContext.Provider
            value={{
                // Auth functions
                registerUser,
                loginUser,
                logoutUser,
                userLoginStatus,
                getUser,
                updateUser,
                uploadPhoto,
                deleteUser,
                fetchAllUsers,
                
                // State values
                user,
                allUsers,
                userState,
                handlerUserInput,
                loading,
                
                // Utility
                initialized
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
};