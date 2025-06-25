import axios from 'axios'
import React, { useEffect, useState } from 'react'

const OtherRequest = () => {

  const [tab, settab] = useState('Pending')
  const [req, setreq] = useState([])
  const [loading, setloading] = useState(true)
  const [remarks, setRemarks] = useState({});


  useEffect(() => {
    const fecthExpense = async () => {
      try {
        const email = localStorage.getItem('email');
        console.log("Sending email:", email)
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/manager-other-request/`, {
          email: email
        })

        setreq(res.data)
        setloading(false)
      } catch (error) {
        console.log('Error fetching data', error);
        setloading(false);
      }
    }

    fecthExpense()

  }, [])


  const handleAction = async (req_id, action) => {
    const remark = remarks[req_id] || '';
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/update_request/`, {
        request_id: req_id,
        action: action,
        remarks: remark
      })  

      console.log(res.data)

      if (res.data.violation ) {
        const proceed = window.confirm(
          ` Policy Violation Detected!\n\n` +
          `Policy Name: ${res.data.policy_name}\n` +
          `Type: ${res.data.policy_type}\n` +
          `Limit: ${res.data.limit}\n` +
          `Already Spent: ${res.data.spent}\n` +
          `This Expense: ${res.data.expense_amount}\n\n` +
          ` Desicion still depend on you.`
        );
        
      if(!proceed){
        return 
      }
        
      }
    
      

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/update_request/`, {
        request_id: req_id,
        action: action,
        remarks: remark,
        force: true 
      });

      setloading(true);
      const email = localStorage.getItem('email');
      const res2 = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/manager-other-request/`, { email });
      setreq(res2.data);
      setloading(false);

    }
    catch (error) {
      console.log('Update failed', error);
    }
  }

  const status_req = req.filter((r) => r.status === tab)

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h2 className="text-2xl font-semibold mb-6">Other Requests</h2>
      <div className="space-x-3 mb-6">
        {['Pending', 'Approved', 'Rejected'].map((val) => (
          <button key={val} onClick={() => settab(val)} className={`px-4 py-2 rounded-full ${tab === val ? 'bg-purple-600 text-white ' : 'bg-gray-200 text-gray-700'} `} >{val}</button>
        ))}
      </div>

      {loading ?
        (<p>Loading...</p>)
        :
        (
          <table className="min-w-full border text-left">
            <thead>
              <tr className='border-b'>
                <th className='py-2 px-3'>Emp Code</th>
                <th className='py-2 px-3'>Emp Name</th>
                <th className='py-2 px-3'>Expense Date</th>
                <th className='py-2 px-3'>Expense Created Date</th>
                <th className='py-2 px-3'>Note</th>
                <th className='py-2 px-3 text-center'>Amount</th>
                <th className='py-2 px-3'>Proof</th>
                {tab === 'Pending' && <th className="py-2 px-3">Remarks & Actions</th>}
              </tr>
            </thead>
            <tbody>
              {status_req.map((data, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3">{data.raised_by_id}</td>
                  <td className="py-2 px-3">{data.raised_by_name}</td>
                  <td className="py-2 px-3">{data.expense_date}</td>
                  <td className="py-3 pl-6 font-medium">
                    {data.request_date
                      ? new Date(data.request_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-3">{data.note}</td>
                  <td className="py-2 px-3 text-right pr-20">{data.amount}</td>
                  <td className="py-2 px-3 pl-2">{data.proof ? (
                    <a
                      href={data.proof}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                      download
                    >
                      Download
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">No file</span>
                  )}</td>
                  {tab === 'Pending' && (
                    <td className="py-2 px-3 space-y-2">
                      <input
                        type="text"
                        placeholder="Remarks"
                        value={remarks[data.request_id] || ''}
                        onChange={(e) =>
                          setRemarks({ ...remarks, [data.request_id]: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                      <div className="space-x-2 mt-2">
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded"
                          onClick={() => handleAction(data.request_id, 'approve')}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleAction(data.request_id, 'reject')}
                        >
                          Reject
                        </button>

                      </div>
                    </td>
                  )}


                </tr>
              ))}
            </tbody>
          </table>
        )
      }

    </div>
  )
}

export default OtherRequest