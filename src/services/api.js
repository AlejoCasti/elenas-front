import connection from './config'
import querystring from 'querystring'

export default {
  signup ({ username, password } = {}) {
    return connection.post('/sign-up/', { username, password })
  },
  login ({ username, password } = {}) {
    return connection.post('/token/', { username, password })
  },
  refreshToken ({ refreshToken } = {}) {
    return connection.post('/token/refresh/', { refresh: refreshToken })
  },
  getTasks ({ page, offset, search } = {}) {
    return connection.get(`/list-tasks/?offset=${offset}&page=${page}&search=${search}`)
  },
  createTask ({ title, description, status } = {}) {
    return connection.post('/create-task/', { title, description, status })
  },
  updateTask ({ id, title, description, status } = {}) {
    return connection.put('/update-task/', { id, title, description, status })
  },
  deleteTask ({ id } = {}) {
    return connection.delete(`/delete-task/${id}/`,)
  }
}