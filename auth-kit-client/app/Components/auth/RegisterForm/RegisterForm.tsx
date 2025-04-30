"use client";
import React from 'react';

function RegisterForm  () {
  return (
    <form className="m-[2rem] px-10 py-14 rounded-lg bg-white w-full max-w-[520px]">
      <div className="relative z-10">
          <h1 className="mb-2 text-center text-[1.35rem] font-medium">
          {""}
            Create an account

          </h1>
          <p className="mb-8 px-[2rem] text-center text-[#999] text-[14px]">
            Create an account. Already have an account?{" "}
            <a className="font-bold text-[#2ECC71] hover:text-[#7263f3] transition-all duration-300" href="/login">
              Login here
            </a>
          </p>
          
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-1 text-[#999]">
             Full Name
            </label>
            <input
              type="text"
              id="name"
              className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
              placeholder="John Doe"/>
          </div>
         
                <div className="mt-[1rem] flex flex-col">
                 <label htmlFor="email" className="mb-1 text-[#999]">
                  Email Adress
                 </label>
                 <input
                   type="email"
                   id="email"
                   className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
                   placeholder="JohnDoe@email.com"/>
               </div>
            
               <div className="relative mt-[1rem] flex flex-col">
               <label htmlFor="password" className="mb-1 text-[#999]">
                Password
               </label>
               <input
                 type="password"
                 id="password"
                 className="px-4 py-3 border-[2px] rounded-md outline-[#2ECC71] text-gray-800"
                 placeholder="*****"
                 />
                 <button className="absolute p.1 right-4 top-[43%] text-[22px] text-[#999] opacity-45">
                  <i className="fas fa-eye"></i>
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
             <div className="felx">
              <button type="Submit" className="mt-[1.5rem] flex-1 px-4 py-3 font-bold bg-[#2ECC71] text-white rounded-md hover:bg-[#1abc9c] transition-colors">
                Register Now
              </button>
             </div>
// seguir video 3:18:20
      </div>
    </form>
  )
}

export default RegisterForm
