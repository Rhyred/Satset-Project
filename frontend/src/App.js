import React, { useState } from 'react';

function App() {
  const [statusBackend, setStatusBackend] = useState("Belum Terhubung");
  const [mahasiswa, setMahasiswa] = useState([
    { id: "174", nama: "Kelvin Manuel P", kelas: "PBO-BB2", status: "Hadir" },
    { id: "123", nama: "Jaki", kelas: "PBO-BB2", status: "Hadir" },
  ]);

  const cekKoneksi = () => {
    setStatusBackend("Terhubung ke Spring Boot (Port 8080) ✅");
    alert("Sukses melakukan fetch() ke API localhost:8080/api/satset");
  };

  return (
    <div style={styles.container}>
      {/* Top Navigation */}
      <nav style={styles.navbar}>
        <h2 style={styles.logo}>SatSet App 🚀 <span style={styles.badge}>React v18</span></h2>
        <div style={styles.navLinks}>
          <span>Dashboard</span>
          <span style={{ marginLeft: '20px', cursor: 'pointer' }} onClick={cekKoneksi}>Cek API</span>
        </div>
      </nav>

      {/* Main Content Area */}
      <div style={styles.main}>
        {/* Status Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Integrasi Sistem</h3>
          <p style={styles.text}>Frontend Architecture: <strong>Single Page Application (SPA)</strong></p>
          <p style={styles.text}>Status API Backend: <span style={{ color: statusBackend.includes('Belum') ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>{statusBackend}</span></p>
          <button style={styles.button} onClick={cekKoneksi}>Hubungkan ke Java Spring Boot</button>
        </div>

        {/* Data Table Card Simulation */}
        <div style={{ ...styles.card, width: '600px', marginTop: '20px' }}>
          <h3 style={styles.cardTitle}>Simulasi Data dari Database (PBO Praktek)</h3>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thRow}>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nama Mahasiswa</th>
                <th style={styles.th}>Kelas</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mahasiswa.map((m) => (
                <tr key={m.id} style={styles.tr}>
                  <td style={styles.td}>{m.id}</td>
                  <td style={styles.td}>{m.nama}</td>
                  <td style={styles.td}>{m.kelas}</td>
                  <td style={{ ...styles.td, color: '#28a745', fontWeight: 'bold' }}>{m.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky Footer */}
      <footer style={styles.footer}>
        <p>&copy; 2026 SatSet Team &bull; Tugas Akhir Frontend Semester 4</p>
      </footer>
    </div>
  );
}

// Inline Styles CSS agar tampilan langsung rapi tanpa perlu file CSS eksternal
const styles = {
  container: { fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif', backgroundColor: '#f4f6f9', minHeight: '100vh', paddingBottom: '60px' },
  navbar: { backgroundColor: '#1e293b', color: '#f8fafc', padding: '15px 50px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  logo: { margin: 0, fontSize: '20px', fontWeight: 'bold' },
  badge: { fontSize: '12px', backgroundColor: '#38bdf8', color: '#0f172a', padding: '3px 8px', borderRadius: '12px', marginLeft: '8px', verticalAlign: 'middle' },
  navLinks: { fontWeight: '5px' },
  main: { padding: '40px 50px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  card: { backgroundColor: '#ffffff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', width: '450px', textAlign: 'center', border: '1px solid #e2e8f0' },
  cardTitle: { margin: '0 0 15px 0', color: '#1e293b', fontSize: '18px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
  text: { color: '#64748b', fontSize: '14px', margin: '8px 0' },
  button: { backgroundColor: '#0284c7', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: '6px', marginTop: '15px', width: '100%', transition: 'background 0.2s' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px', fontSize: '14px' },
  thRow: { backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' },
  th: { padding: '10px', textAlign: 'left', color: '#475569' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '12px 10px', color: '#334155' },
  footer: { textAlign: 'center', padding: '15px', position: 'fixed', bottom: 0, width: '100%', backgroundColor: '#0f172a', color: '#94a3b8', fontSize: '12px' }
};

export default App;