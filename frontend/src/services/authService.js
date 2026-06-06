import { api, getPayload } from './api'

export const authService = {
  login(payload) {
    return api.post('/auth/login', payload).then(getPayload)
  },
  register(payload) {
    return api.post('/auth/register', payload).then(getPayload)
  },
  logout() {
    return api.post('/auth/logout').then(getPayload)
  },
  me() {
    return api.get('/auth/me').then(getPayload)
  },
}
