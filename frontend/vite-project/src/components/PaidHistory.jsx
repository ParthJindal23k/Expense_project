import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaidHistory = () => {
  const [requests, setRequests] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchData = async () => {
    try {
      const email = localStorage.getItem('email');
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/exp_paid_history/`, {
        email,
        start_date: startDate,
        end_date: endDate,
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Failed to fetch paid history', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-6">Paid History</h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="mr-2">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-1 rounded-md"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div>
          <label className="mr-2">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-1 rounded-md"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
      </div>

      <table className="min-w-full border text-left">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="py-2 px-3">Expense Date</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Note</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan="3" className="py-4 px-3 text-center text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            requests.map((r, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">
                  {new Date(r.date).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>
                <td className="py-2 px-3">{r.amount}</td>
                <td className="py-2 px-3">{r.note}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaidHistory;
