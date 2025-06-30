import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!email || !username || !phone_number || !password) {
      toast.info('Please fill in all fields');
      return;
    }

    const data = {
      email,
      password,
      username,
      phone_number
    };

    console.log('Sending data:', data);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/send-otp/`, data);

      if (response.status >= 200 && response.status < 300) {
        toast.success('OTP sent successfully!');
        localStorage.setItem('email',email)
        
        navigate('/verify-otp');
      } else {
        toast.error('Unexpected response status: ' + response.status);
      }

    } catch (error) {
      // Show detailed backend error if available
      const backendError = error.response?.data || error.message;
      toast.error('Something went wrong: ' + JSON.stringify(backendError));
      console.error('Error sending OTP:', backendError);
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-black'>
      <div className="w-full border rounded-2xl sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-md p-6 sm:p-8 bg-[#1a1a1a] shadow-xl">
        <h2 className='text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500'>Create your Account</h2>
        <p className='text-gray-400 text-center mt-2 text-sm'>Register to continue</p>

        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='username' className='text-gray-300 block mb-1 text-sm cursor-pointer'>Username</label>
            <input
              onChange={(e) => setUsername(e.target.value)}
              id='username'
              type="text"
              placeholder='Enter your name'
              className='w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white text-sm'
              required
              value={username}
            />
          </div>
          <div>
            <label htmlFor='email' className='text-gray-300 block mb-1 text-sm cursor-pointer'>Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              id='email'
              type="email"
              placeholder='Enter your email'
              className='w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white text-sm'
              required
              value={email}
            />
          </div>
          <div>
            <label htmlFor='phonenumber' className='text-gray-300 block mb-1 text-sm cursor-pointer'>Phone Number</label>
            <input
              onChange={(e) => setPhoneNumber(e.target.value)}
              id='phonenumber'
              type="text"
              placeholder='10-digit phone number'
              className='w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white text-sm'
              required
              value={phone_number}
              maxLength={10}
            />
          </div>
          <div>
            <label htmlFor='password' className='text-gray-300 block mb-1 text-sm cursor-pointer'>Password</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              id='password'
              type="password"
              placeholder='Enter your password'
              className='w-full p-3 bg-gray-800 rounded-md border border-gray-700 text-white text-sm'
              required
              value={password}
            />
          </div>

          <div className="flex justify-end space-x-1">
            <span className='text-gray-400 text-sm'>Already have an account?</span>
            <a href="/login" className='text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500'>Login</a>
          </div>

          <button
            type="submit"
            className='w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-md text-white font-semibold hover:opacity-90 transition text-sm sm:text-base cursor-pointer'
          >
            Register & Send OTP
          </button>
        </form>

      </div>
    </div>
  );
}

export default Register;
