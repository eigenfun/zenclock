import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const employees = ['Nash', 'Henna', 'Fortina', 'Norelia', 'Sonia', 'Teja', 'Satvik', 'Rama', 'Shashank', 'Ali', 'Anup']

let friendOptions = employees.map(function(emp) {
    let emp_key = emp.toLowerCase();
    return {
      key: emp_key, text: emp, value: emp_key, 
      image: { avatar: true, src: '/images/avatar/' + emp_key + '.jpg' }
    }
})

const EmployeeDropdown = ({changeHandler}) => (
  <Dropdown
    placeholder='Select Employee'
    fluid
    selection
    options={friendOptions}
    onChange={changeHandler}
  />
)

export default EmployeeDropdown