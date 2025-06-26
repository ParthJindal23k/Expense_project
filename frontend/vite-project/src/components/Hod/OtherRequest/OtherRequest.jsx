import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OtherRequest = () => {
  const [tab, settab] = useState('Pending');
  const [req, setreq] = useState([]);
  const [softReq, setSoftReq] = useState([]);
  const [loading, setloading] = useState(true);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchAllRequests();
  }, [tab]);

  const fetchAllRequests = async () => {
    setloading(true);
    const email = localStorage.getItem('email');

    try {
      if (tab === 'Soft Policy Exception') {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/hod-soft-policy-requests/`, { email });
        setSoftReq(res.data);
      } else {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Hod-other-request/`, { email });
        setreq(res.data);
      }
    } catch (error) {
      console.error('Error fetching data', error);
    }
    setloading(false);
  };

  const handleAction = async (req_id, action) => {
    const remark = remarks[req_id] || '';

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/hod_update_request/`, {
        request_id: req_id,
        action,
        remarks: remark
      });

      if (res.data.violation) {
        toast.info(({ closeToast }) => (
          <div>
            <strong>⚠ Policy Violation Detected!</strong>
            <p>Policy: {res.data.policy_name}</p>
            <p>Type: {res.data.policy_type}</p>
            <p>Limit: ₹{res.data.limit}</p>
            <p>Spent: ₹{res.data.spent}</p>
            <p>This Expense: ₹{res.data.expense_amount}</p>
            <div className="flex justify-end mt-2 space-x-2">
              <button
                className="bg-green-600 text-white px-3 py-1 rounded"
                onClick={async () => {
                  closeToast();
                  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/hod_update_request/`, {
                    request_id: req_id,
                    action,
                    remarks: remark,
                    force: true
                  });
                  fetchAllRequests();
                }}
              >
                Approve Anyway
              </button>
              <button
                className="bg-gray-500 text-white px-3 py-1 rounded"
                onClick={closeToast}
              >
                Cancel
              </button>
            </div>
          </div>
        ), { autoClose: false });

        return;
      }

      await fetchAllRequests();

    } catch (error) {
      console.log('Update failed', error);
    }
  };

  const status_req = tab === 'Soft Policy Exception'
    ? softReq
    : req.filter((r) => {
      const status = r.status?.toLowerCase();
      if (tab === 'Approved') return status === 'approved' || status === 'paid';
      return status === tab.toLowerCase();
    });

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6">Other Requests</h2>

      <div className="space-x-3 mb-6">
        {['Pending', 'Approved', 'Rejected', 'Soft Policy Exception'].map((val) => (
          <button
            key={val}
            onClick={() => settab(val)}
            className={`px-4 py-2 rounded-full ${tab === val ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
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
              <th className="py-2 px-3">Emp Code</th>
              <th className="py-2 px-3">Emp Name</th>
              <th className="py-2 px-3">Expense Date</th>
              <th className="py-2 px-3">Created Date</th>
              <th className="py-2 px-3">{tab === 'Soft Policy Exception' ? 'Reason' : 'Note'}</th>
              <th className="py-2 px-3 text-right">Amount</th>
              <th className="py-2 px-3">Proof</th>
              {(tab === 'Pending' || tab === 'Soft Policy Exception') && (
                <th className="py-2 px-3">Remarks & Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {status_req.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 py-4">
                  No {tab} requests found.
                </td>
              </tr>
            ) : (
              status_req.map((data, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3">{data.raised_by_id}</td>
                  <td className="py-2 px-3">{data.raised_by_name}</td>
                  <td className="py-2 px-3">{data.expense_date}</td>
                  <td className="py-2 px-3">
                    {data.request_date
                      ? new Date(data.request_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-3">
                    {tab === 'Soft Policy Exception' ? data.reason : data.note}
                  </td>
                  <td className="py-2 px-3 text-right">{data.amount}</td>
                  <td className="py-2 px-3">{data.proof ? (
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
                  {(tab === 'Pending' || tab === 'Soft Policy Exception') && (
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
