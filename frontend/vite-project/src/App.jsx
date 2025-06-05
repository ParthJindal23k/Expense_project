import React from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path = '/dashboard' element = {
          <PrivateRoute>
            <Dashboard/>
          </PrivateRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App




