import Sidebar from '../components/employee/EmpSidebar'
import Dashboard from '../components/employee/EmpDashboard'

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ">
        <Dashboard />
      </main>
    </div>
  )
}

export default App