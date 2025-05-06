'use client';
import React, {createContext, useEffect, useState, useContext} from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const UserContext = React.createContext();

export const UserContextProvider = ({children}) => {
    const serverUrl = "http://localhost:8000";
    const router = useRouter();
 
    const [user, setUser] = useState({});
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
        if(!userState.name || !userState.email.includes("@") || !userState.password || userState.password.length < 6){
            toast.error("Please fill all the fields correctly (min 6 characters)");
            return;
        }
        try{
            const response = await axios.post(`${serverUrl}/api/v1/register`, userState);
            toast.success("User registered successfully");
            setUserState({
                name: "",
                email: "",
                password: "",
            });
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    }

    // Login user
    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${serverUrl}/api/v1/login`, {
                email: userState.email,
                password: userState.password,
            }, {
                withCredentials: true,
            });
            toast.success("User logged in successfully");
            setUserState({
                email: "",
                password: "",
            });
            await getUser();
            router.push("/");
        } catch (error) {
            toast.error("El usuario y la contraseña no coinciden");
        }
    }

    // Check login status
    const userLoginStatus = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/v1/login_status`, {
                withCredentials: true, 
            });
            const loggedIn = !!res.data;
            setLoading(false);
            if(!loggedIn) router.push("/login");
            return loggedIn;
        } catch (error) {
            console.log("Error al obtener el estado del usuario: ", error);
            return false;
        }
    }

    // Logout
    const logoutUser = async () => {
        try {
            await axios.get(`${serverUrl}/api/v1/logout`, {
                withCredentials: true,
            });
            toast.success("Usuario deslogueado correctamente");
            setUser(null);
            setInitialized(false);
            router.push("/login");
        } catch (error) {
            console.log("Error al cerrar sesión: ", error);
        }
    }

    // Get user details
    const getUser = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${serverUrl}/api/v1/user`, {
                withCredentials: true,
            });
            setUser(res.data);
            // Sync userState with current user data
            setUserState(prev => ({
                ...prev,
                name: res.data.user?.name || "",
                email: res.data.user?.email || "",
                bio: res.data.user?.bio || "",
                photo: res.data.user?.photo || ""
            }));
            setLoading(false);
        } catch (error) {
            toast.error("Error al obtener los detalles del usuario");
            setLoading(false);
        }
    }

    // Update user
    const updateUser = async (data) => {
        setLoading(true);
        try {
            const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
                withCredentials: true,
            });
            
            // Update both user and userState
            setUser(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    ...data
                }
            }));
            
            setUserState(prev => ({
                ...prev,
                ...data
            }));
            
            toast.success("Datos actualizados correctamente");
            setLoading(false);
            return true;
        } catch (error) {
            toast.error("Error al actualizar el usuario");
            setLoading(false);
            return false;
        }
    }

    // Handle file upload
    const uploadPhoto = async (file) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('photo', file);
            
            const res = await axios.patch(`${serverUrl}/api/v1/user/photo`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            setUser(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    photo: res.data.photo
                }
            }));
            
            toast.success("Foto actualizada correctamente");
            return res.data.photo;
        } catch (error) {
            toast.error("Error al subir la foto");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    // Form handler
    const handlerUserInput = (name) => (e) => {
        const value = e.target.value;
        setUserState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!initialized) {
            const loginStatusGetUser = async () => {
                const isLoggedIn = await userLoginStatus();
                if(isLoggedIn) await getUser();
                else setUser({});
                setInitialized(true);
            };
            loginStatusGetUser();
        }
    }, [initialized, router]);
    
    return (
       <UserContext.Provider
        value={{
            registerUser,
            userState,
            handlerUserInput,
            loginUser,
            logoutUser,
            user,
            getUser,
            userLoginStatus,
            updateUser,
            uploadPhoto,
            loading
        }}>
            {children}
        </UserContext.Provider> 
    );
};

export const useUserContext = () => useContext(UserContext);