'use client';

import { useUserContext } from "@/context/userContext";


export default function Home() {
  const user = useUserContext();
  console.log(user);
  return (
    <div>
      <h1>prueba</h1>
    </div>
  );  
}
