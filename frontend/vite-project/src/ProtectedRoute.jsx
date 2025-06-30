import React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({allowedRole , children}) => {
    const role = localStorage.getItem('role')

    if(!allowedRole.includes(role)){
        return <Navigate to = "/unauthorized"/>;
    }

   return children;
}

export default ProtectedRoute
