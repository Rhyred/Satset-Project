import { X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { adminNavItems, citizenNavItems } from '../../utils/constants'
import { useAuth } from '../../hooks/useAuth'

function SidebarLink({ item, onNavigate }) {
  const Icon = item.icon

  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
          isActive
            ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/70 dark:text-primary-200'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-50'
        }`
      }
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </NavLink>
  )
}

export function Sidebar({ mobileOpen, onClose }) {
  const { isAdmin } = useAuth()

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm transition md:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white px-4 py-5 transition-transform dark:border-slate-800 dark:bg-slate-900 md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:sticky md:top-0 md:h-screen`}
      >
        <div className="mb-6 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3" onClick={onClose}>
            <img src="/logo_satset.png" alt="SatSet" className="h-10 w-10 rounded-lg object-contain" />
            <div>
              <p className="text-lg font-semibold tracking-tight text-slate-950 dark:text-slate-50">SatSet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pelayanan & antrean birokrasi</p>
            </div>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50 md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-8 overflow-y-auto pb-6">
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Layanan</p>
            <nav className="space-y-1">
              {citizenNavItems.map((item) => (
                <SidebarLink key={item.to} item={item} onNavigate={onClose} />
              ))}
            </nav>
          </div>

          {isAdmin ? (
            <div className="space-y-2">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                Administrasi
              </p>
              <nav className="space-y-1">
                {adminNavItems.map((item) => (
                  <SidebarLink key={item.to} item={item} onNavigate={onClose} />
                ))}
              </nav>
            </div>
          ) : null}
        </div>
      </aside>
    </>
  )
}
