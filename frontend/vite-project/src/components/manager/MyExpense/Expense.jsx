import axios from 'axios'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);


const Expense = () => {

    const [data, setData] = useState(null);
    const [history, sethistory] = useState([])
    const [pending, setpending] = useState(0)
    const [rejected, setrejected] = useState(0);
    const [statusFilter, setStatusFilter] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const email = localStorage.getItem('email')
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/manager/dashboard/`, { email: email })
                setData(res.data)

                const histres = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/expense-history/`, {
                    email: email
                })


                sethistory(histres.data)


                let pending = 0;
                let rejected = 0;

                histres.data.forEach(exp => {
                    if (
                        exp.status === "Pending" ||
                        exp.status === "Waiting for HoD" ||
                        exp.status === "Waiting for Manager (L1)" ||
                        exp.status === "Approved by Manager (L1), Waiting for HoD"
                    ) {
                        pending += exp.amount;
                    }
                    else if (exp.status === "Rejected") {
                        rejected += exp.amount;
                    }
                });


                setpending(pending)
                setrejected(rejected)


            } catch (error) {
                console.log("Error in Fetching Data", error);

            }
        }

        fetchData()

    }, [])


    const getPrettyTime = (dateString) => {
        const inputDate = dayjs(dateString);
        const today = dayjs();
        const diffInDays = today.diff(inputDate, 'day');

        if (diffInDays > 7) {
            return inputDate.format('D MMM YYYY');
        }
        return inputDate.fromNow();
    };

    const filterHistory = statusFilter ? history.filter(item => item.status === statusFilter) : history


    return (
        <div className='w-full '   >
            <h1 className='text-2xl font-bold mb-6'>Welcome, {data ? data.username : "user"}!</h1>

            <div className="grid grid-cols-2 gap-4 mb-8 ">

                <div className="bg-white p-4 rounded shadow">
                    <h3 className='font-semibold'>Paid History</h3>

                    <button
                        className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                        onClick={() => window.location.href = "/month-history"}
                    >
                        View Paid History
                    </button>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h3 className='font-semibold text-yellow-600 text-2xl'>Pending</h3>
                    <p className=' font-semibold text-yellow-600'>{pending}</p>

                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h3 className='font-semibold text-red-600 text-2xl '>Rejected</h3>
                    <p className='font-semibold text-red-600 '>{rejected}</p>
                </div>
            </div>

            <div className="mt-20 bg-white p-4 rounded-lg shadow ml-4 mr-5">
                <h2 className="mt-2 text-lg font-semibold mb-4">Reimbursement History</h2>

                <div className="mb-4 flex justify-end">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border px-3 py-1 rounded"
                    >
                        <option value="">All Statuses</option>
                        <option value="Approved by HoD, Waiting for Payment">Approved by HoD</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>


                <table className="w-full">
                    <thead>
                        <tr className="bg-gradient-to-r from-pink-300 to-pink-800 text-transparent bg-clip-text">
                            <th className='pb-2  '>Expense Date</th>
                            <th className="pb-2  ">Expense Created Date</th>
                            <th className="pb-2  ">Note</th>
                            <th className="pb-2  ">Amount</th>
                            <th className="pb-2 ">Status</th>
                        </tr>

                    </thead>
                    <tbody className='text-center'>
                        {filterHistory.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="py-4 text-gray-500">No records found.</td>
                            </tr>
                        ) : (
                            filterHistory.map((data, id) => (
                                <tr key={id}>
                                    <td className="py-2">
                                        {new Date(data.expense_date).toLocaleDateString('en-GB')}
                                    </td>
                                    <td className="py-3">
                                        {data.request_date ? getPrettyTime(data.request_date) : 'N/A'}
                                    </td>
                                    <td className="py-2 text-black">{data.note}</td>


                                    <td className="py-2 pl-6 font-medium">{data.amount}</td>


                                    <td className={`font-semibold px-3 py-2 rounded text-sm leading-snug break-words whitespace-normal max-w-[200px]
    ${data.status === 'Approved by HoD, Waiting for Payment' || data.status === 'Approved by Manager (L1), Waiting for HoD' ? 'text-green-600 bg-green-100' :
                                            data.status === 'Waiting for Manager (L1)' ? 'text-yellow-600 bg-yellow-100' :
                                                data.status === 'Waiting for HoD' ? 'text-yellow-600 bg-yellow-100' : data.status === 'Paid' ? 'text-blue-600 bg-blue-100' :
                                                    'text-red-600 bg-red-100'}`}>

                                        {data.status}
                                        {data.status === 'Rejected' && data.reason && (
                                            <div className="text-xs mt-1 text-gray-700 font-normal italic break-words whitespace-normal">
                                                Reason: {data.reason}
                                            </div>

                                        )}
                                    </td>
                                </tr>
                            ))
                        )}

                    </tbody>
                </table>
            </div>



        </div>
    )
}

export default Expense