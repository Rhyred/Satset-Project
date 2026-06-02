import { api, getPayload } from './api'

export const userService = {
  getUsers() {
    return api.get('/users').then(getPayload)
  },
  createUser(payload) {
    return api.post('/users', payload).then(getPayload)
  },
  updateUser(id, payload) {
    return api.put(`/users/${id}`, payload).then(getPayload)
  },
}
