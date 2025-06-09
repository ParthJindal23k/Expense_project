import axios from 'axios'
import React, { useEffect ,useState} from 'react'

const ManagerProfile = () => {

   const [data , setData] = useState(null);

    useEffect(() =>{
        const fetchData = async () =>{
            try {
                const email = localStorage.getItem('email')
                const res = await axios.post('http://localhost:8000/api/manager/dashboard/', {email:email} )
                setData(res.data)
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
        <p className='text-blue-500 font-bold mb-4'>{data ? data.role : 'Role Loading..'}</p>
        <p className='text-blue-500 font-bold mb-4'>{data ? data.department : 'Department Loading..'}</p>
        <div className="text-blue-500 font-bold mb-4">{data ? `${data.grade} Grade` : 'Grade Loading...'}</div>
      </div>

    <div className="w-3/4 p-6 bg-white shadow-lg ml-4 mr-4">
      <h1 className="text-2xl font-semibold mb-4">Your info</h1>
      <hr className='mb-10'/>

      <form className='space-y-4' >
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

        <button className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'>
          Save
        </button>
        <button className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded'>Cancel</button>


      </form>
      
    </div>

    </div>
  )
}

export default ManagerProfile
