import { api, getPayload } from './api'

export const reportService = {
  getAllReports() {
    return api.get('/laporan').then(getPayload)
  },
  getMyReports() {
    return api.get('/laporan/my').then(getPayload)
  },
  createReport(payload) {
    return api.post('/laporan', payload).then(getPayload)
  },
  updateReportStatus(id, payload) {
    return api.put(`/laporan/${id}/status`, payload).then(getPayload)
  },
  getFollowUps() {
    return api.get('/tindak-lanjut').then(getPayload)
  },
}
