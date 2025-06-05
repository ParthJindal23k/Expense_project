import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Welcome to the Expense Tracker</h1>
        <p>This is a simple application to track your expenses.</p>
        <p>Please register or login to continue.</p>

        <Link to="/login">
            <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"> SignIn</button>
        </Link>

        <Link to="/register">
            <button className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"> Register</button>
        </Link>


    </div>
  )
}

export default Home
