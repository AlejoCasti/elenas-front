import { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import apiService from '../services/api'
import jwtDecode from 'jwt-decode'

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const history = useHistory()

  // load user data
  const tokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  let storedUser
  if (tokens) {
    const userData = jwtDecode(tokens.access)
    storedUser = {
      id: userData.user_id,
      username: userData.username
    }
    history.push('/')
  }

  const [user, setUser] = useState(storedUser)
  const [authTokens, setAuthTokens] = useState(tokens)
  const [loading, setLoading] = useState(true)

  const signup = async ({ username, password }) => {
    await apiService.signup({ username, password })
    login({ username, password })
  }

  const login = async ({ username, password }) => {
    const { data } = await apiService.login({ username, password })
    const userData = jwtDecode(data.access)

    // set in localStorage tokens
    localStorage.setItem('authTokens', JSON.stringify(data))

    setAuthTokens(data)
    setUser({
      id: userData.user_id,
      username: userData.username
    })
    history.push('/')
  }

  const logout = () => {
    setAuthTokens(null)
    setUser(null)
    localStorage.clear()
    history.push('/login')
  }

  const refreshToken = async () => {
    const { data } = await apiService.refreshToken({ refreshToken: authTokens.refresh })
    const userData = jwtDecode(data.access)

    // set in localStorage tokens
    localStorage.setItem('authTokens', JSON.stringify(data))

    setAuthTokens(data)
    setUser({
      id: userData.user_id,
      username: userData.username
    })
  }

  useEffect(() => {
    if (authTokens) {
      setUser(jwtDecode(authTokens.access))
    }
    setLoading(false)
  }, [authTokens, loading])

  const authContextData = {
    login,
    logout,
    signup,
    refreshToken,
    userData: user
  }

  return (
    <AuthContext.Provider value={authContextData}>{children}</AuthContext.Provider>
  )
}

const getAuthContext = () => {
  const auth = useContext(AuthContext)

  return auth
}
export default AuthContext
export { AuthProvider, getAuthContext }