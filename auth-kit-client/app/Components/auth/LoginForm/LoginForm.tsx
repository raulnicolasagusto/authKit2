"use client";
import React from 'react';
import { useUserContext } from '@/context/userContext.js';



function LoginForm  () {
  const {loginUser, userState, handlerUserInput} = useUserContext();
  const { name, email, password } = userState;
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <form className="m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]" onSubmit={loginUser}>
      
      <div className="relative z-10">
          <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          {""}
            Login to your account

          </h1>
          <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
            Login Now. Don't have an account?{" "}
            <a className="font-bold text-[#2ECC71] hover:text-[#7263f3] transition-all duration-300" href="/register">
              Register here
            </a>
          </p>
          
          
                <div className="mt-[1rem] flex flex-col">
                 <label htmlFor="email" className="mb-1 text-[#999]">
                  Email Adress
                 </label>
                 <input
                   type="email"
                   id="email"
                   value={email}
                   onChange={(e) => handlerUserInput("email")(e)}
                   className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
                   placeholder="JohnDoe@email.com"/>
               </div>
            
               <div className="relative mt-[1rem] flex flex-col">
               <label htmlFor="password" className="mb-1 text-[#999]">
                Password
               </label>
               <input
                 type={showPassword ? "text" : "password"}
                 id="password"
                 value={password}
                 onChange={(e) => handlerUserInput("password")(e)}
                 className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
                 placeholder="*****"
                 />
                 <button type="button" className="absolute p.1 right-4 top-[43%] text-[22px] text-[#999] opacity-45" onClick={togglePassword}>
                  {showPassword ? (
                    <i className="fas fa-eye"></i>
                  ) : (
                    <i className="fas fa-eye-slash"></i>
                  )}
                  
                 </button>
             </div>
             <div className="mt-4 flex justify-end">
              <a
              href="/forgot-password"
              className="font-bold text-[#2ECC71] text-[14px] hover:text-[#7263f3] transition-all duration-300"
              >
              Forgot password?
              </a>
             </div>
             <div className="flex">
             <button
              type="submit"
              disabled={!email || !password}
              className={`mt-[1.5rem] flex-1 px-4 py-3 font-bold text-white rounded-md transition-colors
                ${!email || !password? 'bg-gray-400 cursor-not-allowed' : 'bg-[#2ECC71] hover:bg-[#1abc9c]'}`}
              >
              Login
            </button>
             </div>
      </div>
    </form>
  )
}

export default LoginForm
