'use client';
import React, {createContext, useEffect, useState, useContext} from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';
import { get } from 'http';

const UserContext = React.createContext();

export const UserContextProvider = ({children}) => {
    const serverUrl = "http://localhost:8000";
    const router = useRouter();
 
    const [user, setUser] = useState({});

    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false); //

    //register user
    const registerUser = async (e) => {
        e.preventDefault();
        if(!userState.name || !userState.email.includes("@") || !userState.password || userState.password.length < 6){
            toast.error("Please fill all the fields correctly (min 6 characters)");
            return;
        }
        try{
            const response = await axios.post(`${serverUrl}/api/v1/register`, userState);
            console.log("Usuario registrado correctamente", response.data);
           
            toast.success("User registered successfully");
            //clear the form
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


//login user

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
      
      // Forzar la obtención de los datos del usuario
      await getUser();
      router.push("/");
      
    } catch (error) {
      console.log("Error al iniciar sesión: ", error);
      toast.error("El usuario y la contraseña no coinciden", error.response.data.message);
    }
  }
// Get user looged in status

const userLoginStatus = async () => {
    let loggedIn = false;
    try {
        
        const res = await axios.get(`${serverUrl}/api/v1/login_status`, {
            withCredentials: true, 
        });
       
       
        loggedIn = !!res.data;
        setLoading(false);

        if(!loggedIn){
            router.push("/login");
        }

    } catch (error) {
        
        console.log("Error al obtener el estado del usuario: ", error);
        
    }
    
    
    return loggedIn;
    
}

//Loggout
const logoutUser = async () => {
    try {
        const res = await axios.get(`${serverUrl}/api/v1/logout`, {
            withCredentials: true,
        });

        toast.success("Usuario deslogueado correctamente");
        setUser(null);
        setInitialized(false); // 🔄 Reinicia para cargar nuevo usuario después
        router.push("/login");
    } catch (error) {
        console.log("Error al cerrar sesión: ", error);
    }
}
//get user details
const getUser = async () => {
    setLoading(true);
    try {
        const res = await axios.get(`${serverUrl}/api/v1/user`, {
            withCredentials: true,
        });

        setUser((prevState) => {
            return {
                ...prevState,
                ...res.data,
            }
        });
        setLoading(false);

    } catch (error) {
        console.log("Error al obtener los detalles del usuario: ", error);
        toast.error("Error al obtener los detalles del usuario: ", error);
        setLoading(false);
    }
}

    
    //update user
const updateUser = async (data) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/api/v1/user`, data, {
        withCredentials: true,
      });
      
      // Actualiza el estado del usuario con la nueva bio
      setUser(prev => ({
        ...prev,
        user: {
          ...prev.user,
          bio: data.bio
        }
      }));
      
      toast.success("Bio updated successfully");
      setLoading(false);
      return true;
    } catch (error) {
      console.log("Error updating bio:", error);
      toast.error("Error updating bio");
      setLoading(false);
      return false;
    }
  }
    // dynamic form hadler

    const handlerUserInput = (name) => (e) => {
        const value = e.target.value;
        setUserState((prevState)=>({
            ...prevState,
            [name]: value,
        }));
    };

   

    useEffect(() => {
        if (!initialized) { // ✅ Solo se ejecuta si no está inicializado
            const loginStatusGetUser = async () => {
                const isLoggedIn = await userLoginStatus();
                
                if (isLoggedIn) {
                    await getUser();
                } else {
                    setUser({});
                }
                
                setInitialized(true); // 🏁 Marca como inicializado
            };

            loginStatusGetUser();
        }
    }, [initialized, router]);
    
    return(
       
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
            }}>
            {children}
        </UserContext.Provider> 
    );
};

export const useUserContext = () => {
    return useContext(UserContext);
    
}
