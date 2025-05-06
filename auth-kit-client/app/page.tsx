'use client';

import { useUserContext } from "@/context/userContext";
import useRedirect from "@/hooks/useUserRedirect";



export default function Home() {
  useRedirect("/login");
  const {user, logoutUser} = useUserContext();
  const { name, photo, email, isVerified, bio } = user?.user || {};
  const { loading } = useUserContext();
  console.log("user", user);

  
  return (
    <main className="py-[2rem] mx-[1rem] sm:mx-[10rem]">
      <header className="flex flex-col sm:flex-row justify-between items-center sticky top-0 bg-white z-10 py-4 shadow-md">
        <h1 className="text-[1.5rem] sm:text-[2rem] font-bold text-center sm:text-left">
          Bienvenido/a <span className="text-red-600">{name}</span>
        </h1>
  
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <img
            src={photo}
            alt={name}
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
          {!isVerified && (
            <button className="px-4 py-2 rounded-md bg-yellow-500 text-white">
              Verificación pendiente
            </button>
          )}
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-md"
            onClick={logoutUser}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
    </main>
  );
}
