import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OtherRequest = () => {
  const [tab, settab] = useState('Pending');
  const [req, setreq] = useState([]);
  const [loading, setloading] = useState(true);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setloading(true);
    try {
      const email = localStorage.getItem('email');
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/manager-other-request/`, {
        email: email
      });
      setreq(res.data);
    } catch (error) {
      console.log('Error fetching data', error);
    }
    setloading(false);
  };

  const forceAction = async (req_id, action, remark) => {
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/update_request/`, {
      request_id: req_id,
      action,
      remarks: remark,
      force: true
    });
    fetchRequests();
  };

  const handleAction = async (req_id, action) => {
    const remark = remarks[req_id] || '';

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/update_request/`, {
        request_id: req_id,
        action,
        remarks: remark
      });

      if (res.data.violation) {
        toast.info(
          ({ closeToast }) => (
            <div>
              <strong>⚠️ Policy Violation</strong>
              <p><b>Policy:</b> {res.data.policy_name}</p>
              <p><b>Type:</b> {res.data.policy_type}</p>
              <p><b>Limit:</b> {res.data.limit}</p>
              <p><b>Spent:</b> {res.data.spent}</p>
              <p><b>This Expense:</b> {res.data.expense_amount}</p>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={async () => {
                    closeToast();
                    await forceAction(req_id, action, remark);
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
          ),
          { autoClose: false }
        );
        return;
      }

      await forceAction(req_id, action, remark);
    } catch (error) {
      console.log('Update failed', error);
    }
  };

  const status_req = req.filter((r) => r.status === tab);

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-6">Other Requests</h2>
      <div className="space-x-3 mb-6">
        {['Pending', 'Approved', 'Rejected'].map((val) => (
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
            <tr className='border-b'>
              <th className='py-2 px-3'>Emp Code</th>
              <th className='py-2 px-3'>Emp Name</th>
              <th className='py-2 px-3'>Expense Date</th>
              <th className='py-2 px-3'>Created Date</th>
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
                <td className="py-2 px-3">{new Date(data.expense_date).toLocaleDateString('en-GB')}</td>
                <td className="py-3 pl-6 font-medium">
                  {data.request_date
                    ? new Date(data.request_date).toLocaleDateString('en-GB')
                    : 'N/A'}
                </td>
                <td className="py-2 px-3">{data.note}</td>
                <td className="py-2 px-3 text-right pr-20">{data.amount}</td>
                <td className="py-2 px-3 pl-2">
                  {data.proof ? (
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
                  )}
                </td>
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
      )}
    </div>
  );
};

export default OtherRequest;
