import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { Sidebar } from '../components/navigation/Sidebar.jsx'
import { Topbar } from '../components/navigation/Topbar.jsx'

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="app-shell md:flex">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="min-w-0 flex-1 md:min-h-screen">
        <Topbar onOpenSidebar={() => setMobileOpen(true)} />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
