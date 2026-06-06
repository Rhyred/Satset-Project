import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, LogOut, Sun, Moon, Command } from 'lucide-react';

interface LayoutProps {
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const searchResults = [
    { title: 'Dashboard Beranda', path: '/' },
    { title: 'Ambil Antrean Layanan Publik', path: '/queue' },
    { title: 'Tulis Laporan & Aduan Warga', path: '/reports' },
    { title: 'Lihat Mading & Pengumuman', path: '/mading' },
    { title: 'Kotak Masuk Notifikasi', path: '/notifications' },
    { title: 'Pengaturan Akun & Profil', path: '/account' },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const [darkMode, setDarkMode] = React.useState(
    localStorage.getItem('dark-mode') === 'true'
  );

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('dark-mode', String(next));
    document.documentElement.classList.toggle('dark', next);
    setDropdownOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Command Palette on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      // Close on Escape
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const avatarChar = user?.namaLengkap
    ? user.namaLengkap.substring(0, 1).toUpperCase()
    : 'U';

  return (
    <>
      <Sidebar />
      <div className="main-wrapper">
        {/* Context Bar */}
        <header className="context-bar">
          <h1 className="context-title" style={{ flex: 1 }}>{title || 'SatSet'}</h1>
          
          <div className="context-center hide-mobile" style={{ flex: 2, display: 'flex', justifyContent: 'center' }}>
            <button 
              className="search-trigger-btn"
              onClick={() => setSearchOpen(true)}
              title="Cari (Cmd+K / Ctrl+K)"
            >
              <Search size={16} className="text-tertiary" />
              <span>Cari menu, layanan, atau laporan...</span>
              <div className="search-shortcut">⌘K</div>
            </button>
          </div>

          <div className="context-actions" style={{ flex: 1, justifyContent: 'flex-end', position: 'relative' }}>
            
            {/* Mobile Search Icon (Hidden on Desktop) */}
            <button 
              className="btn btn-ghost btn-icon show-mobile-only" 
              onClick={() => setSearchOpen(true)}
              aria-label="Cari menu, layanan, atau laporan"
              style={{ display: 'none' }} // Managed by CSS media query typically, but we'll use a class
            >
              <Search size={18} />
            </button>

            {user && (
              <div className="relative" ref={dropdownRef} style={{ position: 'relative' }}>
                <div 
                  className="user-menu" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <div className="avatar" style={{ width: '2rem', height: '2rem', fontSize: '0.875rem' }}>
                    {avatarChar}
                  </div>
                  <div className="hide-mobile" style={{ flexDirection: 'column' }}>
                    <span className="user-menu-name">{user.namaLengkap}</span>
                    <span className="user-menu-role" style={{ fontSize: '0.625rem' }}>{user.role}</span>
                  </div>
                </div>

                {/* Profile Dropdown Popup */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="dropdown-popup"
                    >
                      <div className="dropdown-header">
                        <div className="font-semibold text-sm text-primary-color">{user.namaLengkap}</div>
                        <div className="text-xs text-tertiary">{user.email}</div>
                      </div>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item" onClick={() => { setDropdownOpen(false); navigate('/account'); }}>
                        <User size={16} /> <span>Profil Akun</span>
                      </button>
                      <button className="dropdown-item" onClick={toggleDarkMode}>
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />} 
                        <span>{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                      </button>
                      <div className="dropdown-divider"></div>
                      <button className="dropdown-item text-error" onClick={logout}>
                        <LogOut size={16} /> <span>Keluar</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette Popup */}
      <AnimatePresence>
        {searchOpen && (
          <div className="modal-overlay" style={{ alignItems: 'flex-start', paddingTop: '10vh' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="modal-backdrop"
              onClick={() => setSearchOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="modal-panel"
              style={{ padding: 0, maxWidth: '560px', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
                <Search size={20} className="text-tertiary" style={{ marginRight: '0.75rem' }} />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Cari menu, layanan, atau laporan..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    flex: 1, border: 'none', background: 'transparent', outline: 'none', 
                    fontSize: '1rem', color: 'var(--text-primary)' 
                  }}
                />
                <div style={{ fontSize: '0.625rem', border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 6px', color: 'var(--text-tertiary)' }}>ESC</div>
              </div>
              <div style={{ padding: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                <div style={{ padding: '0.5rem 0.75rem', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  {searchQuery ? 'Hasil Pencarian' : 'Pintasan Cepat'}
                </div>
                {searchResults.map((result, idx) => (
                  <button key={idx} className="dropdown-item" onClick={() => { setSearchOpen(false); navigate(result.path); }}>
                    <Command size={16} /> <span>{result.title}</span>
                  </button>
                ))}
                {searchResults.length === 0 && (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                    Tidak ada hasil ditemukan untuk "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
