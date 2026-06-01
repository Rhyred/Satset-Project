import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  ClipboardList,
  FileText,
  Megaphone,
  Bell,
  User as UserIcon,
  ShieldAlert,
  LogOut,
  Sun,
  Moon,
  Plus
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem('sidebar-collapsed') === 'true'
  );
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('dark-mode') === 'true'
  );

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebar-collapsed', String(next));
  };

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('dark-mode', String(next));
    document.documentElement.classList.toggle('dark', next);
  };

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/notifikasi/my');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setUnreadCount(data.filter(n => !n.isRead).length);
          }
        }
      } catch (e) {
        console.error('Error fetching unread notifs', e);
      }
    };
    fetchUnread();
    
    const interval = setInterval(fetchUnread, 30000); // 30s polling
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' active' : ''}`;

  return (
    <>
      {/* Desktop Navigation Rail */}
      <nav className={`nav-rail ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="nav-brand">
          <div className="nav-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="nav-logo-text-wrapper" style={{ display: isCollapsed ? 'none' : 'block' }}>
            <span className="nav-logo-text">SatSet</span>
            <span className="nav-logo-sub">Super App</span>
          </div>
        </div>

        <div className="nav-section">
          <span className="nav-section-label">Utama</span>
          <NavLink to="/dashboard" className={linkClass}>
            <Home /> <span className="nav-link-text">Beranda</span>
          </NavLink>

          <span className="nav-section-label">Layanan</span>
          <NavLink to="/queue" className={linkClass}>
            <ClipboardList /> <span className="nav-link-text">Antrean</span>
          </NavLink>
          <NavLink to="/reports" className={linkClass}>
            <FileText /> <span className="nav-link-text">Laporan</span>
          </NavLink>

          <span className="nav-section-label">Komunikasi</span>
          <NavLink to="/mading" className={linkClass}>
            <Megaphone /> <span className="nav-link-text">Pengumuman</span>
          </NavLink>
          <NavLink to="/notifikasi" className={linkClass}>
            <Bell /> <span className="nav-link-text">Notifikasi</span>
            {unreadCount > 0 && <span className="nav-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}
          </NavLink>

          <span className="nav-section-label">Pengaturan</span>
          <NavLink to="/account" className={linkClass}>
            <UserIcon /> <span className="nav-link-text">Akun Saya</span>
          </NavLink>

          {user.role === 'ADMIN' && (
            <>
              <span className="nav-section-label">Administrasi</span>
              <NavLink to="/admin" className={linkClass}>
                <ShieldAlert /> <span className="nav-link-text">Panel Admin</span>
              </NavLink>
            </>
          )}
        </div>

        <div className="nav-footer">
          <button onClick={toggleCollapse} className="nav-footer-btn" title="Kecilkan / Besarkan" aria-label={isCollapsed ? "Besarkan Menu Sidebar" : "Kecilkan Menu Sidebar"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
              <path d="M15 18l-6-6 6-6" />
            </svg>
            <span className="nav-link-text">Perkecil Menu</span>
          </button>
          <button onClick={toggleDarkMode} className="nav-footer-btn" title="Ganti Tema" aria-label={darkMode ? 'Ubah ke Mode Terang' : 'Ubah ke Mode Gelap'}>
            {darkMode ? <Sun /> : <Moon />}
            <span className="nav-link-text">{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>
          <button onClick={logout} className="nav-footer-btn danger" title="Keluar" aria-label="Keluar dari Akun">
            <LogOut />
            <span className="nav-link-text">Keluar</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}>
          <Home /> <span>Beranda</span>
        </NavLink>
        <NavLink to="/queue" className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}>
          <ClipboardList /> <span>Antrean</span>
        </NavLink>
        
        {/* Floating Action Button (FAB) for Quick Action on Mobile */}
        <NavLink to="/reports" className="bottom-nav-fab" title="Buat Laporan Cepat">
          <Plus />
        </NavLink>
        
        <NavLink to="/mading" className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}>
          <Megaphone /> <span>Mading</span>
        </NavLink>
        <NavLink to="/account" className={({ isActive }) => `bottom-nav-link${isActive ? ' active' : ''}`}>
          <UserIcon /> <span>Akun</span>
        </NavLink>
      </nav>
    </>
  );
};
