import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

export function getPayload(response) {
  return response?.data?.data ?? response?.data
}

export function getErrorMessage(error, fallback = 'Terjadi kesalahan pada sistem') {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  )
}
