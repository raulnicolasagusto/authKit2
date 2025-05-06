"use client";

import { useEffect } from "react";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";


const useRedirect = (redirect: string) => {
    const {userLoginStatus} = useUserContext();
    const router = useRouter();

    useEffect(() => {
       const redirectUser = async () => {
        try {
            const isLoggedUser = await userLoginStatus();
            console.log("isLoggedUser", isLoggedUser);
            if(!isLoggedUser){
                router.push(redirect);
            }
        } catch (error) {
            console.log("Error al redirigir al usuario: ", error);
        }
       }
       redirectUser();
    },[userLoginStatus, redirect, router]);
}


export default useRedirect;