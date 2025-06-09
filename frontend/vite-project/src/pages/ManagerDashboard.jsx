import React, { useState } from 'react'
import ManagerProfile from '../components/manager/Profile/ManagerProfile'
import OtherRequest from '../components/manager/OtherRequest/OtherRequest'
import CreateExpenseRequest from '../components/manager/CreateRequest/CreateExpenseRequest';
import Sidebar from '../components/manager/Sidebar';
import Expense from '../components/manager/MyExpense/Expense';

const ManagerDashboard = () => {

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

            case 'Other Request':
                return(
                    <OtherRequest/>
                )
                break;

            case 'Profile':
                return (
                    <ManagerProfile/>
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

export default ManagerDashboard
