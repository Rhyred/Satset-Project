import { api, getPayload } from './api'

export const queueService = {
  getCategories() {
    return api.get('/kategori-layanan').then(getPayload)
  },
  getAllQueues() {
    return api.get('/antrean').then(getPayload)
  },
  getMyQueues() {
    return api.get('/antrean/my').then(getPayload)
  },
  createQueue(payload) {
    return api.post('/antrean', payload).then(getPayload)
  },
  updateQueueStatus(id, status) {
    return api.put(`/antrean/${id}/status`, { status }).then(getPayload)
  },
}
