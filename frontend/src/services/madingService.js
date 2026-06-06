import { api, getPayload } from './api'

export const madingService = {
  getPublished() {
    return api.get('/mading').then(getPayload)
  },
  getAll() {
    return api.get('/mading/all').then(getPayload)
  },
  save(payload) {
    if (payload.id) {
      return api.put(`/mading/${payload.id}`, payload).then(getPayload)
    }

    return api.post('/mading', payload).then(getPayload)
  },
  remove(id) {
    return api.delete(`/mading/${id}`).then(getPayload)
  },
}
