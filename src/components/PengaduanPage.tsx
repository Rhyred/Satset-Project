import React, { useState } from 'react';

const PengaduanPage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans flex items-center justify-center">
      <div className="w-full max-w-2xl bg-[#1e293b] rounded-2xl border border-slate-700 p-8 shadow-xl">
        
        {/* Header Form */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Form Pengaduan Warga</h2>
          <p className="text-slate-400 text-sm">Laporkan masalah fasilitas umum atau lingkungan sekitar Anda secara instan.</p>
        </div>
        
        {/* Form Pengaduan */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Judul Laporan</label>
            <input 
              type="text" 
              placeholder="Contoh: Lampu Jalan Patah / Jalan Rusak" 
              className="w-full bg-[#0f172a] border border-slate-600 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            />
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Isi Laporan / Keluhan Detail</label>
            <textarea 
              rows={5} 
              placeholder="Ceritakan kronologi dan detail lokasi masalah secara jelas..." 
              className="w-full bg-[#0f172a] border border-slate-600 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            ></textarea>
          </div>

          {/* Tombol Submit */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            Kirim Laporan Resmi 🚀
          </button>
        </form>

      </div>
    </div>
  );
};

export default PengaduanPage;