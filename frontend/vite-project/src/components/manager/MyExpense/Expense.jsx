import axios from 'axios'
import React, { useEffect, useState } from 'react'


const Expense = () => {

    const [data , setData] = useState(null);
    const [history , sethistory] = useState([])

    useEffect(() =>{
        const fetchData = async () =>{
            try {
                const email = localStorage.getItem('email')
                const res = await axios.post('http://localhost:8000/api/manager/dashboard/', {email:email} )
                setData(res.data)
                
                const histres = await axios.post('http://localhost:8000/api/expense-history/', {
                    email:email
                })

                sethistory(histres.data)


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

      <div className="mt-20 bg-white p-4 rounded-lg shadow ml-4 mr-5">
      <h2 className="mt-2 text-lg font-semibold mb-4">Reimbursement History</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-pink-300 to-pink-800 text-transparent bg-clip-text">
            <th className='pb-2'>Expense Date</th>
            <th className="pb-2">Expense Request Date</th>
            <th className="pb-2">Category</th>
            <th className="pb-2">Amount</th>
            <th className="pb-2">Status</th>
          </tr>
          
        </thead>
        <tbody>
          {history.map((data , id) => (
            <tr key = {id}>
                <td>{data.expense_date}</td>
                <td>{data.request_date}</td>
                <td>{data.note}</td>
                <td>{data.amount}</td>
                <td>{data.status}</td>
            </tr>
          )   )}
        </tbody>
      </table>
    </div>



    </div>
  )
}

export default Expense
