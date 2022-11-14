import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { getAuthContext } from '../context/Authentication'

const ProtectedRoute = ({ children, ...props }) => {
  const context = getAuthContext()

  return !context.userData ? <Redirect to='/login' /> : <Route {...props}/>
}

export default ProtectedRoute