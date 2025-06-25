import axios from 'axios'
import React, { useState } from 'react'

const CreateExpenseRequest = () => {
  const email = localStorage.getItem('email')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [amount, setamount] = useState('')
  const [proof, setproof] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const policyCheck = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/check-policy/`, {
        email: email,
        amount: parseInt(amount)
      })

      const status = policyCheck.data.status;
      if (status == 'allowed') {

        const formData = new FormData()
        formData.append('email', email)
        formData.append('date', date)
        formData.append('note', note)
        formData.append('amount', amount)
        formData.append('proof', proof)



        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/expenses/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (res.status === 201) {
          alert('Expense submitted successfully!')
          setDate('')
          setNote('')
          setamount('')
          setproof(null)
        } else {
          alert('Something went wrong')
        }
      }
      else if (status === 'soft_violation') {
        const reason = window.prompt("This exceed soft policy limits. Please enter a reason for requesting HOD approvals:");
        if (reason && reason.trim() !== "") {
          const formData = new FormData()
          formData.append('email', email)
          formData.append('date', date)
          formData.append('note', note)
          formData.append('amount', amount)
          formData.append('reason_for_hod', reason.trim())
          formData.append('proof', proof);
          const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/request-hod-policy-approval/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })

         if (res.status === 200) {
            alert("Request sent to HOD for approval.")
            setDate('')
            setNote('')
            setamount('')
            setproof(null)
          } else {
            alert("Failed to send request to HOD.")
          }
        }
      }
      else if (status === 'hard_violation') {
        alert("This expense violates a hard policy. You are not allowed to create this expense.");
      }

    } catch (error) {
      alert("failed.");
      console.log(error);
    }
  }

  return (
    <div className='min-h-screen items-center justify-center pl-50 pt-20'>
      <div className="bg-white w-full max-w-5xl shadow-2xl rounded-xl ">

        <div className="bg-blue-600 text-white text-center py-6 px-10">
          <h1 className='text-4xl font-bold'>Create New Expense</h1>
          <p className='text-md mt-2'>Please fill in details below to submit your expense claim</p>
        </div>

        <form
          className='p-10 grid grid-cols-1 md:grid-cols-2 gap-8'
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <label htmlFor="a" className='block text-gray-700 font-semibold mb-2'>Your Email</label>
            <p className='w-full px-4 py-3 bg-gray-300 rounded-lg' id="a">{email}</p>
          </div>

          <div>
            <label htmlFor="b" className='block text-gray-700 font-semibold mb-2'>Date of Expense</label>
<input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              type="date"
              required
              id="b"
              max={new Date().toISOString().split("T")[0]} 
/>          </div>

          <div>
            <label htmlFor="c" className='block text-gray-700 font-semibold mb-2'>Note / Description</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Describe what this expense was for..." className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' required id="c" />
          </div>

          <div>
            <label htmlFor="d" className='block text-gray-700 font-semibold mb-2'>Amount (INR)</label>
            <input value={amount} onChange={(e) => setamount(e.target.value)} placeholder="e.g., 1200" className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500' type="text" required id="d" />
          </div>

          <div>
            <label htmlFor="e" className='block text-gray-700 font-semibold mb-2'>Upload Expense Proof</label>
            <input
              onChange={(e) => setproof(e.target.files[0])}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              required
              id="e"
            />
            <p className='text-sm text-gray-500 mt-1'>Acceptable formats: PDF, JPG, PNG</p>
          </div>

          <div className="md:col-span-2 flex justify-center pb-10">
            <button type="submit" className="w-40 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">Submit Expense</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateExpenseRequest
