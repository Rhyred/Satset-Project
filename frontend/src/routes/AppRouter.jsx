import { Navigate, Route, Routes } from 'react-router-dom'
import { DashboardLayout } from '../layouts/DashboardLayout.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { PublicOnlyRoute } from './PublicOnlyRoute.jsx'
import { AdminRoute } from './AdminRoute.jsx'
import { LoginPage } from '../pages/auth/LoginPage.jsx'
import { RegisterPage } from '../pages/auth/RegisterPage.jsx'
import { DashboardPage } from '../pages/DashboardPage.jsx'
import { QueuePage } from '../pages/QueuePage.jsx'
import { ReportsPage } from '../pages/ReportsPage.jsx'
import { MadingPage } from '../pages/MadingPage.jsx'
import { NotificationsPage } from '../pages/NotificationsPage.jsx'
import { AccountPage } from '../pages/AccountPage.jsx'
import { AdminPage } from '../pages/AdminPage.jsx'
import { UsersPage } from '../pages/UsersPage.jsx'
import { NotFoundPage } from '../pages/NotFoundPage.jsx'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/queue" element={<QueuePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/mading" element={<MadingPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/account" element={<AccountPage />} />

          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="/notifikasi" element={<Navigate to="/notifications" replace />} />
    </Routes>
  )
}
