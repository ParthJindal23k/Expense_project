import React from 'react'

const Sidebar = ({currentSection , onChangeSection}) => {

  const sections = ['My Expenses', 'Create Request' , 'Other Request','Profile']


  return (
    <div>
      <h2>Dashboard</h2>
      <ul>
        {sections.map((val) =>(
          <li key = {val} onClick={() => onChangeSection(val)}  className={`cursor-pointer px-4 py-2 rounded-md ${currentSection === val ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-200'}`}  >
              {val}
          </li>
        ))  }
      </ul>
    </div>
  )
}

export default Sidebar
