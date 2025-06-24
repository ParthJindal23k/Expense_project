import axios from 'axios'
import React, { useEffect, useState } from 'react'

const OtherRequest = () => {
  const [tab, settab] = useState('Pending');
  const [req, setreq] = useState([]);
  const [loading, setloading] = useState(true);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const email = localStorage.getItem('email');
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Hod-other-request/`, {
          email: email
        });

        setreq(res.data);
        setloading(false);
      } catch (error) {
        console.log('Error fetching data', error);
        setloading(false);
      }
    };

    fetchExpense();
  }, []);

  const handleAction = async (req_id, action) => {
    const remark = remarks[req_id] || '';
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/hod_update_request/`, {
        request_id: req_id,
        action: action,
        remarks: remark
      });

      setloading(true);
      const email = localStorage.getItem('email');
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Hod-other-request/`, { email });
      setreq(res.data);
      setloading(false);
    } catch (error) {
      console.log('Update failed', error);
    }
  };

  // ✅ Fix: make status filter case-insensitive
  const status_req = req.filter((r) => {
    const status = r.status?.toLowerCase();
    if (tab === 'Approved') return status === 'approved' || status === 'paid';
    return status === tab.toLowerCase();
  });
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h2 className="text-2xl font-semibold mb-6">Other Requests</h2>

      <div className="space-x-3 mb-6">
        {['Pending', 'Approved', 'Rejected'].map((val) => (
          <button
            key={val}
            onClick={() => settab(val)}
            className={ `px-4 py-2 rounded-full ${tab === val ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}          >
            {val}
          </button>
        ))}
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="min-w-full border text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3">Emp ID</th>
              <th className="py-2 px-3">Emp Name</th>
              <th className="py-2 px-3">Expense Date</th>
              <th className="py-2 px-3">Expense Created Date</th>
              <th className="py-2 px-3">Note</th>
              <th className='py-2 px-3 text-center pr-8'>Amount</th>
              <th className="py-2 px-3">Status</th>
              {tab === 'Pending' && <th className="py-2 px-3">Remarks & Actions</th>}
            </tr>
          </thead>
          <tbody>
            {status_req.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-4">
                  No {tab} requests found.
                </td>
              </tr>
            ) : (
              status_req.map((data, idx) => (
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
                  <td className="py-2 px-3 pl-2">{data.status}</td>
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
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OtherRequest;