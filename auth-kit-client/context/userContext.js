'use client';
import React, {createContext, useEffect, useState, useContext} from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

const UserContext = React.createContext();

export const UserContextProvider = ({children}) => {
    const serverUrl = "http://localhost:8000";
    const router = useRouter();
 
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(true);

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
        },{
            withCredentials: true,  // send cokies to the server
        });
        console.log("Usuario logueado correctamente: ", res.data);
        toast.success("User logged in successfully: ");
        //clear the form
        setUserState({
            email: "",
            password: "",
        });
        router.push("/");

    } catch (error) {
        console.log("Error al iniciar sesión: ", error);
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
    
    return(
       
       <UserContext.Provider
        value={{
            registerUser,
            userState,
            handlerUserInput,
            loginUser,
            }}>
            {children}
        </UserContext.Provider> 
    );
};

export const useUserContext = () => {

    return useContext(UserContext);
}
