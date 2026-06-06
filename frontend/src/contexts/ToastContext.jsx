import { createContext, useMemo, useState } from 'react'

export const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  const addToast = ({ title, description, tone = 'info' }) => {
    const id = window.crypto.randomUUID()
    setToasts((current) => [...current, { id, title, description, tone }])

    window.setTimeout(() => {
      removeToast(id)
    }, 4000)
  }

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts],
  )

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
}
