import React, { useState } from 'react'
import CompensatorProfile from '../components/compensator/Profile/CompensatorProfile'
import OtherRequest from '../components/compensator/OtherRequest/OtherRequest'
import Sidebar from '../components/compensator/Sidebar';


const CompensatorDashboard = () => {

    const [section , setsection] = useState('Other Request')

    const renderSection = () =>{
        switch (section) {
            case 'Other Request':
                return(
                    <OtherRequest/>
                )
                break;

            case 'Profile':
                return (
                    <CompensatorProfile/>
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

export default CompensatorDashboard
