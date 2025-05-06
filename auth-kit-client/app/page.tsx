'use client';

import { useUserContext } from "@/context/userContext";


export default function Home() {
  const {user, logoutUser} = useUserContext();
  console.log("El nombre de usuario es: ", user);
  return (
    <main className="py-[2rem] mx-[10rem]">
      <header className="flex items-center justify-center">
        <h1 className="text-[2rem] font-bold">Bienvenido a la página de Iniccio de Auth KIT, <span>{user.name}</span></h1>
      </header>
      <div className="flex items-center justify-center">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={logoutUser}>Cerrar sesión</button>
      </div>
    </main>
  );  
}
