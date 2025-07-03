import axios from 'axios'
import React, { useState } from 'react'
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const CreateExpenseRequest = ({ setsection }) => {
  const email = localStorage.getItem('email')
  const [date, setDate] = useState('')
  const [note, setNote] = useState('')
  const [amount, setamount] = useState('')
  const [proof, setproof] = useState(null)
  const [reason, setReason] = useState('')
  const [showModal, setShowModal] = useState(false)

  const notify = () => {
    toast.success('Expense submitted successfully! Redirecting... ')
    setTimeout(() => {
      setsection("My Expenses")
    }, 5000)
  }

  const resetForm = () => {
    setDate('')
    setNote('')
    setamount('')
    setproof(null)
    setReason('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const policyCheck = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/check-policy/`, {
        email: email,
        amount: parseInt(amount)
      })

      const status = policyCheck.data.status

      if (status === 'allowed') {
        await submitExpense()
      } else if (status === 'soft_violation') {
        setShowModal(true) // Show modal for HOD reason
      } else if (status === 'hard_violation') {
        toast.info("This expense violates a hard policy. You are not allowed to create this expense.")
      }

    } catch (error) {
      toast.error("Submission failed.")
      console.log(error)
    }
  }

  const submitExpense = async () => {
    const formData = new FormData()
    formData.append('email', email)
    formData.append('date', date)
    formData.append('note', note)
    formData.append('amount', amount)
    formData.append('proof', proof)

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/expenses/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    if (res.status === 201) {
      notify()
      resetForm()
    } else {
      toast.error("Something went wrong")
    }
  }

  const submitHODApproval = async () => {
    if (!reason.trim()) {
      toast.error("Reason is required")
      return
    }

    const formData = new FormData()
    formData.append('email', email)
    formData.append('date', date)
    formData.append('note', note)
    formData.append('amount', amount)
    formData.append('reason_for_hod', reason.trim())
    formData.append('proof', proof)

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/request-hod-policy-approval/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (res.status === 200) {
        toast.success("Request sent to HOD for approval. Redirecting ...")
        setTimeout(() => {
          setsection("My Expenses")
        }, 5000)

        resetForm()
        setShowModal(false)
      } else {
        toast.error("Failed to send request to HOD.")
      }

    } catch (err) {
      console.log(err)
      toast.error("Failed to send request.")
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
            <label className='block text-gray-700 font-semibold mb-2'>Your Email</label>
            <p className='w-full px-4 py-3 bg-gray-300 rounded-lg'>{email}</p>
          </div>

          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Date of Expense</label>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              type="date"
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Note / Description</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Describe what this expense was for..."
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Amount (INR)</label>
            <input
              value={amount}
              onChange={(e) => setamount(e.target.value)}
              placeholder="e.g., 1200"
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              type="number"
              required
            />
          </div>

          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Upload Expense Proof</label>
            <input
              onChange={(e) => setproof(e.target.files[0])}
              className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500'
              type="file"
              accept="application/pdf,image/png,image/jpeg"
              required
            />
            <p className='text-sm text-gray-500 mt-1'>Acceptable formats: PDF, JPG, PNG</p>
          </div>

          <div className="md:col-span-2 flex justify-center pb-10">
            <button type="submit" className="w-40 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200">
              Submit Expense
            </button>
          </div>
        </form>
      </div>

      <div className="relative z-0">
        <div className="bg-white w-full max-w-5xl shadow-2xl rounded-xl mx-auto">
        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg animate-fadeIn z-50">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">Policy Violation</h2>
            <p className="text-xl text-gray-700 mb-2">
              This expense exceeds soft policy limits. Please enter a reason for HOD approval:
            </p>

            <textarea
              className="textarea textarea-bordered w-full mb-4 bg-gray-100 rounded-xl focus:outline-none focus:border-transparent p-2"
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write your reason here..."
            />


            <div className="flex justify-end gap-3">
              <button
                className="btn btn-outline cursor-pointer"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary cursor-pointer"
                onClick={submitHODApproval}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateExpenseRequest
