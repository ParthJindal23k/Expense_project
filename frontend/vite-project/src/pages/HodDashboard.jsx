import React, { useState } from 'react'
import Sidebar from '../components/Hod/Sidebar';
import OtherRequest from '../components/Hod/OtherRequest/OtherRequest'
import HodProfile from '../components/Hod/Profile/Profile';

const HodDashboard = () => {

    const [section , setsection] = useState('Profile')

    const renderSection = () =>{
        switch (section) {

            case 'Other Request':
                return (
                    <OtherRequest/>
                )
                break;



            case 'Profile':
                return (
                    <HodProfile/>
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

export default HodDashboard
