const ExpenseTable = () => {
  const expenses = [
    { date: '2025-06-01', category: 'Travel', amount: '₹1,200', status: 'Approved' },
    { date: '2025-06-03', category: 'Food', amount: '₹500', status: 'Pending' },
    { date: '2025-06-05', category: 'Supplies', amount: '₹2,000', status: 'Rejected' },
  ]

  return (
    <div className="bg-gray-100 h-85">

    <div className="mt-20 bg-white p-4 rounded-lg shadow ml-4 mr-5">
      <h2 className="mt-2 text-lg font-semibold mb-4">Reimbursement</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gradient-to-r from-pink-300 to-pink-800 text-transparent bg-clip-text">
            <th className="pb-2">Date</th>
            <th className="pb-2">Category</th>
            <th className="pb-2">Amount</th>
            <th className="pb-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp, idx) => (
              <tr key={idx} className="border-t border-gray-200 text-sm">
              <td className="py-2">{exp.date}</td>
              <td>{exp.category}</td>
              <td>{exp.amount}</td>
              <td className={exp.status === 'Approved' ? 'text-green-500' : exp.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}>
                {exp.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  )
}

export default ExpenseTable