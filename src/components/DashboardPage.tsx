import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Dashboard */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Dashboard SatSet</h1>
          <p className="text-slate-400 text-sm">Selamat datang kembali di sistem pelayanan warga mandiri.</p>
        </div>
        
        {/* Grid Kartu Informasi Utama */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Kartu 1 */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl transition-all hover:border-slate-600">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Total Laporan Pengaduan</h3>
            <p className="text-4xl font-extrabold text-white tracking-tight">12</p>
            <span className="text-xs text-blue-400 mt-2 inline-block">Meningkat dari bulan lalu</span>
          </div>
          
          {/* Kartu 2 */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl transition-all hover:border-slate-600">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Laporan Sedang Diproses</h3>
            <p className="text-4xl font-extrabold text-amber-400 tracking-tight">3</p>
            <span className="text-xs text-amber-400/80 mt-2 inline-block">Butuh tindakan segera</span>
          </div>
          
          {/* Kartu 3 */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl transition-all hover:border-slate-600">
            <h3 className="text-slate-400 text-sm font-medium mb-2">Laporan Selesai Ditangani</h3>
            <p className="text-4xl font-extrabold text-emerald-400 tracking-tight">9</p>
            <span className="text-xs text-emerald-400/80 mt-2 inline-block">Sukses terselesaikan</span>
          </div>
        </div>

        {/* Kotak Informasi Tambahan */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-xl">
          <h3 className="font-bold text-lg text-white mb-3">Pengumuman Warga</h3>
          <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 text-slate-300 text-sm">
            💡 Sistem SatSet versi React kini telah aktif. Silakan gunakan menu pengaduan untuk melaporkan kendala fasilitas umum di sekitar lingkungan Anda.
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;