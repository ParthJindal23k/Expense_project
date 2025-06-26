import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyOtp from './pages/VerifyOtp'
import LandingPage from './pages/LandingPage'
import EmpDashboard from './pages/EmpDashboard'
import HodDashboard from './pages/HodDashboard'
import ManagerDashboard from './pages/ManagerDashboard'
import CompensatorDashboard from './pages/CompensatorDashboard'
import { ToastContainer } from 'react-toastify';  
import 'react-toastify/dist/ReactToastify.css';
import PaidHistory from './components/PaidHistory'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path = '/' element = {<LandingPage/>} />
        <Route path = "/register" element={<Register />} />
        <Route path = "/login" element={<Login />} />
        <Route path = '/verify-otp'element = {<VerifyOtp/>}   />
        <Route path = '/Emp-Dashboard' element = {<EmpDashboard/>}/>
        <Route path = '/Hod-Dashboard' element = {<HodDashboard/>}/>
        <Route path = '/Manager-Dashboard' element = {<ManagerDashboard/>}/>
        <Route path = '/Compensator-Dashboard' element = {<CompensatorDashboard/>}/>
         <Route path="/month-history" element={<PaidHistory />} />
     </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  )
}

export default App
