import './App.css'
import React from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './utils/ProtectedRoute'
import { Route, withRouter, Switch } from 'react-router-dom'
import { AuthProvider } from './context/Authentication'

function App() {
  return (
    <React.StrictMode> {/** react 18 is not working correctly with react dom v5 */}
      <div className="App">
        <AuthProvider>
          <Route component={Login} path='/login' />
          <ProtectedRoute component={Home} path='/' exact />
        </AuthProvider>
      </div>
    </React.StrictMode>
  )
}

export default App
