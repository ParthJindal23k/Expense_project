import axios from 'axios';
import React, { useEffect, useState } from 'react';

const OtherRequest = () => {
  const [tab, settab] = useState('Approved');
  const [req, setreq] = useState([]);
  const [loading, setloading] = useState(true);
  const [remarks, setRemarks] = useState({});
  const [allemployee, setAllemployee] = useState([]); // 🆕 for filter
  const [selectedEmployee, setSelectedEmployee] = useState(''); // 🆕 for filter

  useEffect(() => {
    fetchAllEmployeeNames();
    fetchExpense();
  }, [tab]);

  const fetchAllEmployeeNames = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-employees/`);
      setAllemployee(res.data);
    } catch (error) {
      console.error('Failed to fetch employee names', error);
    }
  };

  const fetchExpense = async () => {
    try {
      setloading(true);
      const email = localStorage.getItem('email');
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Comp-other-request/`, { email });
      setreq(res.data);
    } catch (error) {
      console.log('Error fetching data', error);
    } finally {
      setloading(false);
    }
  };

  const handleAction = async (req_id, action) => {
    const remark = remarks[req_id] || '';
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/Comp_update_request/`, {
        request_id: req_id,
        action: action,
        remarks: remark
      });
      fetchExpense(); // Refresh
    } catch (error) {
      console.log('Update failed', error);
    }
  };

  // 🆕 Apply both tab and employee filter
  const status_req = req.filter((r) => {
    const matchStatus = r.status === tab;
    const matchEmployee = selectedEmployee === '' || r.raised_by_id === parseInt(selectedEmployee);
    return matchStatus && matchEmployee;
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <h2 className="text-2xl font-semibold mb-6">Other Requests</h2>

      {/* Tabs */}
      <div className="space-x-3 mb-6">
        {['Approved', 'Paid'].map((val) => (
          <button
            key={val}
            onClick={() => settab(val)}
            className={`px-4 py-2 rounded-full ${tab === val ? 'bg-purple-600 text-white ' : 'bg-gray-200 text-gray-700'}`}
          >
            {val}
          </button>
        ))}
      </div>

      {/* 🆕 Filter Dropdown */}
      <div className="mb-4">
        <label className='block text-gray-700 font-medium mb-1'>Filter by Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className='border border-gray-300 px-4 py-2 rounded-lg w-full max-w-xs'
        >
          <option value="">All Employees</option>
          {allemployee.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.username}</option>
          ))}
        </select>
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
              <th className='py-2 px-3'>Expense Created Date</th>
              <th className='py-2 px-3'>Note</th>
              <th className='py-2 px-3 text-center pr-8'>Amount</th>
              <th className='py-2 px-3'>Status</th>
              {tab === 'Approved' && <th className="py-2 px-3">Remarks & Actions</th>}
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
                  <td className="py-2 px-3">{new Date(data.expense_date).toLocaleDateString('en-GB')}</td>
                  <td className="py-3 px-3">
                    {data.request_date
                      ? new Date(data.request_date).toLocaleDateString('en-GB')
                      : 'N/A'}
                  </td>
                  <td className="py-2 px-3">{data.note}</td>
                  <td className="py-2 px-3 text-right pr-8">{data.amount}</td>
                  <td className="py-2 px-3">{data.status}</td>
                  {tab === 'Approved' && (
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
                          onClick={() => handleAction(data.request_id, 'paid')}
                        >
                          Paid
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
