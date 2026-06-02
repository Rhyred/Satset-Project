import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { MotionPage } from './components/MotionPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { LandingPage } from './pages/LandingPage';
import { Home } from './pages/Home';
import { Queue } from './pages/Queue';
import { ReportFeed } from './pages/ReportFeed';
import { MadingFeed } from './pages/MadingFeed';
import { Notifikasi } from './pages/Notifikasi';
import { Account } from './pages/Account';
import { AdminDashboard } from './pages/AdminDashboard';

// Route guard for Admin role
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Route guard for authenticated users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes */}
        <Route path="/login" element={<MotionPage><Login /></MotionPage>} />
        <Route path="/register" element={<MotionPage><Register /></MotionPage>} />

        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Citizen routes */}
        <Route element={<ProtectedRoute><Layout title="Beranda" /></ProtectedRoute>}>
          <Route path="/dashboard" element={<MotionPage><Home /></MotionPage>} />
        </Route>
        
        <Route element={<ProtectedRoute><Layout title="Antrean Layanan" /></ProtectedRoute>}>
          <Route path="/queue" element={<MotionPage><Queue /></MotionPage>} />
        </Route>

        <Route element={<ProtectedRoute><Layout title="Laporan & Aduan Warga" /></ProtectedRoute>}>
          <Route path="/reports" element={<MotionPage><ReportFeed /></MotionPage>} />
        </Route>

        <Route element={<ProtectedRoute><Layout title="Mading Digital Kelurahan" /></ProtectedRoute>}>
          <Route path="/mading" element={<MotionPage><MadingFeed /></MotionPage>} />
        </Route>

        <Route element={<ProtectedRoute><Layout title="Notifikasi" /></ProtectedRoute>}>
          <Route path="/notifikasi" element={<MotionPage><Notifikasi /></MotionPage>} />
        </Route>

        <Route element={<ProtectedRoute><Layout title="Profil Akun" /></ProtectedRoute>}>
          <Route path="/account" element={<MotionPage><Account /></MotionPage>} />
        </Route>

        {/* Admin Panel routes */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Routes>
                <Route element={<Layout title="Panel Kontrol Admin" />}>
                  <Route path="" element={<MotionPage><AdminDashboard /></MotionPage>} />
                </Route>
              </Routes>
            </AdminRoute>
          }
        />

        {/* Redirect old users path */}
        <Route path="/users" element={<Navigate to="/admin" replace />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app-root">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
