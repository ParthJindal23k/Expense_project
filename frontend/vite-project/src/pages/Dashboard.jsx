import React from 'react'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const Navigate = useNavigate();
    const handleLogOut = () =>{
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token')
        Navigate('/login');
    }


  return (
    <div>
        <h1>
            welcome to dashboard
        </h1>
        <p>This is a protected route, accessible only after login.</p>
        <button onClick={handleLogOut} >LogOut</button>
    </div>
  )
}

export default Dashboard
