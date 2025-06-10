import React , {useState} from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [email ,setemail] = useState('');
  const [password ,setpassword] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async(e) =>{
    e.preventDefault();

    const data = {
      email,
      password
    }


    try {
      const res = await axios.post('http://localhost:8000/auth/login/',data)

      if(res.status == 200){
        const role = res.data.role
        alert(`Login successfully , You are redirected to ${role} dashboard`)
        localStorage.setItem('tempPhone', res.data.phone_number);
        localStorage.setItem('email', email)

        if(role == 'HoD'){
          navigate('/HoD-Dashboard')

        }
        else if(role == "Manager"){
          navigate('/Manager-Dashboard')
        }
        else if(role == 'Compensator'){
          navigate('/Compensator-Dashboard')
        }else{
          navigate('/Emp-Dashboard')
        }

      }

    } catch (error) {
       console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed!');
    }


  }

  
  return (
     <div className='min-h-screen flex items-center justify-center bg-black'>
      <div className="w-full border rounded-2xl sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-md p-6 sm:p-8 bg-[#1a1a1a] shadow-xl  ">
        <h2 className='text-3xl  font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500'>Login your Account</h2>
        <p className='text-gray-400 text-center mt-2 text-sm py-5'>Login to continue</p>

      <form className='  space-y-5'>
        <div className="">
          <label htmlFor='email' className='text-gray-300 block mb-1 text-sm cursor-pointer' >Email</label>
            <input onChange={(e) =>setemail(e.target.value) } id = 'email' type="email" placeholder='Enter your email' className='w-full p-3 bg-gray-800 rounded-md border-gray-700 text-white text-sm'/>
        </div>
    
        <div className="">
          <label htmlFor='password' className='text-gray-300 block mb-1 text-sm cursor-pointer' >Password</label>
            <input onChange={(e) =>setpassword(e.target.value) } id = 'password' type="password" placeholder='Enter your password' className='w-full p-3 bg-gray-800 rounded-md border-gray-700 text-white text-sm'/>
        </div>

      <div className="flex justify-end">
        <span className='text-gray-400 text-sm'>Don't have an account?</span>   
        <a href="/register" className= ' text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-purple-500'>Register</a>
      </div>

        <button onClick={handleSubmit} className='mt-4  w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500  rounded-md text-white font-semibold hover:opacity-90 transition text-sm sm:text-base cursor-pointer'>Login </button>

      </form>


      </div>
    </div>
  )
}

export default Login
