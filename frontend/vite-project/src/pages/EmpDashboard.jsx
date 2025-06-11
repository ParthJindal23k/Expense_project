import React, { useState } from 'react'
import CreateExpenseRequest from '../components/employee/CreateRequest/CreateExpenseRequest';
import Sidebar from '../components/employee/Sidebar';
import Expense from '../components/employee/MyExpense/Expense';
import EmpProfile from '../components/employee/Profile/EmpProfile'

const EmpDashboard = () => {

    const [section , setsection] = useState('My Expenses')

    const renderSection = () =>{
        switch (section) {
            case 'My Expenses':
                return (
                    <Expense/>
                )
                break;

            case 'Create Request':
                return(
                    <CreateExpenseRequest/>
                )
                break;


            case 'Profile':
                return (
                    <EmpProfile/>
                )
                break;
        
        }

    }
  return (
    <div className='flex'>
        <div className="flex min-h-screen ">
            <Sidebar currentSection = {section} onChangeSection = {setsection} />
        </div>
        <div className="flex-1 p-6 bg-gray-100">
            {renderSection()}
        </div>
    </div>
  )
}

export default EmpDashboard
