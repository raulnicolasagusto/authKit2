'use client';
import React, {createContext, useEffect, useState, useContext} from 'react';
import { useRouter } from 'next/navigation';

const UserContext = React.createContext();

export const UserContextProvider = ({children}) => {
    const serverUrl = "http://localhost:8000";
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [userState, setUserState] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(true);

    //register user
    const registerUser = async (userData) => {
        
    }

    
    return(
       <UserContext.Provider value={"Hola desde el UserContext"}>
            {children}
        </UserContext.Provider> 
    );
};

export const useUserContext = () => {

    return useContext(UserContext);
}