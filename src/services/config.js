import axios from 'axios'
import dayjs from 'dayjs'
import jwtDecode from 'jwt-decode'

const baseURL = import.meta.env.VITE_API_BASE_URL

const apiConnection = axios.create({
  baseURL
})

apiConnection.interceptors.request.use(async req => {
  const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
  if (!authTokens) return req

  req.headers.Authorization = `Bearer ${authTokens.access}`
  const user = jwtDecode(authTokens.access)
  const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1

  if (!isExpired) return req

  const { data } = await axios.post(`${baseURL}/token/refresh/`, {
    refresh: authTokens.refresh
  })

  localStorage.setItem('authTokens', JSON.stringify(data))
  req.headers.Authorization = `Bearer ${data.access}`
  return req
})

export default apiConnection