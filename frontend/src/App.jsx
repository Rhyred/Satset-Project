import { AuthProvider } from './contexts/AuthContext.jsx'
import { ThemeProvider } from './contexts/ThemeContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { ToastViewport } from './components/feedback/ToastViewport.jsx'
import { AppRouter } from './routes/AppRouter.jsx'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <AppRouter />
          <ToastViewport />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
