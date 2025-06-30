import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const VerifyOtp = () => {

    const [otp , setotp] = useState(['','','','','','']);

    const handleChange = (idx , val ) =>{
        const newotp = [...otp]
        newotp[idx] = val
        setotp(newotp);
    }
    const navigate = useNavigate()

    const handleSubmit = async () =>{
        const otpval = otp.join("")
        console.log("OTP to send:", otpval);
        const email = localStorage.getItem("email");



        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-otp/`,{
                otp:otpval,
                email:email
            })

             if (res.status === 200) {
                toast.success('OTP Verified Successfully!');
                navigate('/login')
               
             } else {
                toast.error('Verification failed');
              }

              

        } catch (error) {
            console.error('Error verifying OTP:', error);
            toast.error(error.response?.data?.message || 'Something went wrong!');
        }

    }

  return (
    <div className='min-h-screen flex justify-center items-center bg-black text-white  '>
      <div className="bg-[#1a1a1a]  rounded-2xl px-8 py-10 shadow-lg max-w-md w-full">
        <h2 className='text-3xl font-bold text-center mb-2'>Verify your Email</h2>
        <p className='text-center text-gray-400 mb-8'>Enter your 6-digit OTP from your email</p>

        <div className="flex justify-between gap-2 mb-6">
            {
                otp.map((digit,idx) => (
                    <input   key={idx} pattern='[0-9]*' inputMode='numeric' onChange={(e) => handleChange(idx , e.target.value)} className='border w-10 h-12 text-center text-xl bg-[#2c2c2c] text-white rounded-md border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500' type="text" value={digit} maxLength={1}  />
                ))
            }
        </div>

        <button onClick={handleSubmit} className='w-full border py-2 rounded-md bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 '>
            Verify OTP
        </button>

      </div>
    </div>
  )
}

export default VerifyOtp
