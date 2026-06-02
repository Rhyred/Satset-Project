import { api, getPayload } from './api'

export const dashboardService = {
  getStats() {
    return api.get('/dashboard/stats').then(getPayload)
  },
  getRecentReports() {
    return api.get('/dashboard/laporan-terbaru').then(getPayload)
  },
  getActiveQueues() {
    return api.get('/dashboard/antrean-aktif').then(getPayload)
  },
}
