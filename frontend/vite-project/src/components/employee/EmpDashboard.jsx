import ExpenseTable from './EmpExpenseTable'

const Dashboard = () => {
  return (
    <div className='bg-gray-100 pt-1'>
      <h1 className="text-2xl font-bold mb-4 ml-4 pt-5 ">Welcome, Krish!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mb-6 mr-5">
        <div className="mt-20 bg-white p-4 rounded-lg shadow ml-4">
          <h2 className="mt-2 text-lg font-semibold mb-2">Total Reimbursed</h2>
          <p className="text-2xl text-green-500 font-bold">₹1200</p>
          
        </div>
        <div className="mt-20 bg-white p-4 rounded-lg shadow ml-4">
          <h2 className="mt-2 text-lg font-semibold mb-2">Pending</h2>
          <p className="text-2xl text-yellow-500 font-bold">₹500</p>
         
        </div>
        <div className="mt-20 bg-white p-4 rounded-lg shadow ml-4">
          <h2 className="mt-2 text-lg font-semibold mb-2">Rejected</h2>
          <p className="text-2xl text-red-500 font-bold">₹2000</p>
          <h3 className="mt-3 text-2xl">*Policy voilation*</h3>
        </div>
      </div>
      <ExpenseTable />
    </div>
  )
}

export default Dashboard