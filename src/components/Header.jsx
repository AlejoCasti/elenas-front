import React, { useMemo } from 'react'
import { getAuthContext } from '../context/Authentication'
import './header.css'

function Header () {
  const context = getAuthContext()

  function logoutUser(e) {
    e.preventDefault()
    context.logout()
  }

  return (
    <div className='header flex justify-between items-center bg-white rounded-sm px-4 py-3 sm:px-10'>
      <img className='w-24 sm:w-32' src="https://www.elenas.co/co/wp-content/uploads/2022/09/elenas.png" alt="Elenas icon" />
      <button className='w-32 btn-primary' onClick={logoutUser}>Cerrar sesión</button>
    </div>
  )
}

export default Header