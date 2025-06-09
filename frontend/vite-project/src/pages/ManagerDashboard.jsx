import React, { useState } from 'react'
import ManagerProfile from '../components/manager/Profile/ManagerProfile'
import OtherRequest from '../components/manager/OtherRequest/OtherRequest'
import CreateExpenseRequest from '../components/manager/CreateRequest/CreateExpenseRequest';
import Sidebar from '../components/manager/Sidebar';

const ManagerDashboard = () => {

    const [section , setsection] = useState('My Expenses')

    const renderSection = () =>{
        switch (section) {
            case 'My Expenses':
                return (
                    <div className="">
                        Your data will be shown here
                    </div>
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
    <div>
        <div className="">
            <Sidebar currentSection = {section} onChangeSection = {setsection} />
        </div>
        <div className="">
            {renderSection()}
        </div>
    </div>
  )
}

export default ManagerDashboard
