import React from 'react'
const Sidebar = ({currentSection , onChangeSection}) => {
  const sections = ['My Expenses', 'Create Request', 'Profile']
  return (
    <div className=' w-64 bg-white h-screen shadow-md p-4'>
      <h2 className='text-2xl font-bold  mb-10 mt-3'>Employee-Dashboard</h2>
      <ul className='space-y-2'>
        {sections.map((val) =>(
          <li key = {val} onClick={() => onChangeSection(val)}  className={
            `cursor-pointer px-4 py-2 rounded-md 
            ${currentSection === val ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-200'}`
            }  >
              {val}
          </li>
        ))  }
      </ul>
    </div>
  )
}
export default Sidebar
