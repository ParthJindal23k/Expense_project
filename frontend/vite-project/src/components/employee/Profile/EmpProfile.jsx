import axios from 'axios'
import React, { useEffect ,useState} from 'react'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"

const ManagerProfile = () => {

    const [newpassword,setnewpassword] = useState('')
    const [confirmpassword , setconfirmpassword] = useState('')


    const handlePasswordReset = async(e) =>{
      e.preventDefault()

      if (newpassword !== confirmpassword) {
        toast.error("Passwords do not match!");
        return;
      }

      try {
        const email = localStorage.getItem('email')
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password/`,{
          email: email,
          password : newpassword
        })
        
        if(res.status = 200){
          toast.success('Password reset successful !')
          setnewpassword('')
          setconfirmpassword('')
        }
        else{
          toast.error('something went wrong')
          
        }

      } catch (error) {

        console.error("Password reset failed", error);
        toast.error("Something went wrong!");

      }



    }


   const [data , setData] = useState(null);

    useEffect(() =>{
        const fetchData = async () =>{
            try {
                const email = localStorage.getItem('email')
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/manager/dashboard/`, {email:email} )
                setData(res.data)
                console.log(data.id)
            } catch (error) {
                console.log("Error in Fetching Data", error);

            }
        }

        fetchData()

    }, [])

  return (
    <div className='flex bg-gray-100'>
      <div className="w-1/4 bg-white shadow-lg p-6 flex flex-col items-center">
        <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-xl mb-4">Photo</div>  
        <h2 className='text-xl font-bold mb-4'>{data ? data.username : 'Name Loading..'}</h2>
        <p className='text-blue-500 font-bold mb-4'>{data ? data.id : 'ID Loading..'}</p>
        <p className='text-blue-500 font-bold mb-4'>{data ? data.role : 'Role Loading..'}</p>
        <p className='text-blue-500 font-bold mb-4'>{data ? data.department : 'Department Loading..'}</p>
        <div className="text-blue-500 font-bold mb-4">{data ? `${data.grade} Grade` : 'Grade Loading...'}</div>
      </div>

    <div className="w-3/4 p-6 bg-white shadow-lg ml-4 mr-4">
      <h1 className="text-2xl font-semibold mb-4">Your info</h1>
      <hr className='mb-10'/>

      <div className='space-y-4' >
        <div className="">
          <label htmlFor=""  className='block text-lg mb-3 font-bold'>Name</label>
          <p className='w-150  p-2 rounded-lg bg-gray-200' >{data ? data.username : 'Name Loading..'}</p>
        </div>
        <div className="">
          <label htmlFor="" className='block text-lg mb-3 font-bold' >Email Address</label>
          <p className='w-150  p-2 rounded-lg bg-gray-200'>{data ? data.email : 'Email Loading..'}</p>
        </div>
        <div className="">
          <label htmlFor="" className='block text-lg mb-3 font-bold'>Phone number</label>
          <p className='w-150  p-2 rounded-lg bg-gray-200'>{data ? data.phone_number : 'Phone number Loading..'}</p>
        </div>
      </div>

      <form action="" className='space-y-4'>
        <hr className='my-6'/>
        <h2 className='text-xl font-semibold mb-2' >Reset Password</h2>
        <div className="">
          <label htmlFor="inp1" className='block text-lg mb-2 font-bold'>New Password</label>
          <input value={newpassword} onChange={(e) => setnewpassword(e.target.value)} type="password"  id="inp1" className='w-full p-2 rounded-lg border border-gray-300' />
        </div>

        <div className="">
          <label htmlFor="inp2" className='block text-lg mb-2 font-bold'>Confirm Password</label>
          <input value={confirmpassword} onChange={(e) => setconfirmpassword(e.target.value)} type="text"  id="inp2" className='w-full p-2 rounded-lg border border-gray-300'/>
        </div>

        <button onClick={handlePasswordReset} className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4'>Reset Password</button>


      </form>




    </div>

    </div>
  )
}

export default ManagerProfile
