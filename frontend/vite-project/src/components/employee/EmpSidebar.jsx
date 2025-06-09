const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-white shadow-md p-4">
      <h2 className="mt-2.5 text-xl font-bold mb-6">Dashboard</h2>
      <ul className="mt-20 space-y-8">
        {['My Expenses', 'Create Request', 'Approvals', 'Profile'].map((item) => (
          <li key={item} className="text-base duration-300 text-gray-700 hover:text-black-600 cursor-pointer hover:font-extrabold hover:text-lg transition-all">{item}</li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar