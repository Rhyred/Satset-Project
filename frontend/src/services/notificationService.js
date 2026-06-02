import { api, getPayload } from './api'

export const notificationService = {
  getMyNotifications() {
    return api.get('/notifikasi/my').then(getPayload)
  },
  getUnreadCount() {
    return api.get('/notifikasi/unread-count').then(getPayload)
  },
  markRead(id) {
    return api.put(`/notifikasi/${id}/read`).then(getPayload)
  },
  delete(id) {
    return api.delete(`/notifikasi/${id}`).then(getPayload)
  },
  create(payload) {
    return api.post('/notifikasi', payload).then(getPayload)
  },
}
