'use client';
import React, {createContext, useEffect, useState, useContext} from 'react';

const UserContext = React.createContext();

export const UserContextProvider = ({children}) => {
    
    return(
       <UserContext.Provider value={"Hola desde el UserContext"}>
            {children}
        </UserContext.Provider> 
    );
};

export const useUserContext = () => {

    return useContext(UserContext);
}