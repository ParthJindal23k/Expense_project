import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Expense = () => {

    const [data , setData] = useState(null);

    useEffect(() =>{
        const fetchData = async () =>{
            try {
                const email = localStorage.getItem('email')
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/manager/dashboard/`, {email:email} )
                setData(res.data)
            } catch (error) {
                console.log("Error in Fetching Data", error);

            }
        }

        fetchData()

    }, [])


  return (
    <div className= 'w-full '   >
      <h1 className='text-2xl font-bold mb-6'>Welcome, {data ? data.username : "user"}!</h1>

      <div className="grid grid-cols-2 gap-4 mb-8 ">
        <div className="bg-white p-4 rounded shadow">
            <h3 className='font-semibold'> Total Reimbursed this week</h3>
            <p>1200</p>
            <p>Limit</p>

        </div>

        <div className="bg-white p-4 rounded shadow">
            <h3 className='font-semibold'>Total Reimbursed this month</h3>
            <p>2800</p>
            <p>Limit</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
            <h3 className='font-semibold'>Pending</h3>
            <p>Amount</p>
            <p>Message</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
            <h3 className='font-semibold'>Rejected</h3>
            <p>Amount</p>
        </div>



      </div>



    </div>
  )
}

export default Expense
