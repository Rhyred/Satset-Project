import React from 'react';

const ProfilPage = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* Banner Profil (Mirip Screenshot) */}
        <div className="bg-[#1e293b] rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="h-40 bg-gradient-to-r from-blue-600 to-blue-500"></div>
          <div className="p-6 relative flex justify-end">
            {/* Lingkaran Inisial W */}
            <div className="absolute -top-12 left-8 w-24 h-24 bg-blue-700 rounded-full border-4 border-[#1e293b] flex items-center justify-center text-3xl font-bold shadow-2xl text-white">
              W
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Akun Terverifikasi</span>
            </div>
          </div>
        </div>

        {/* Bagian Bawah: Data & Aktivitas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Kotak Data Pribadi */}
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg h-fit">
            <h3 className="text-lg font-bold mb-4">Data Pribadi</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Email</label>
                <p className="text-sm text-slate-200">kelvin@contoh.com</p>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all">
                Edit Profil
              </button>
            </div>
          </div>

          {/* Kotak Riwayat Aktivitas */}
          <div className="md:col-span-2 bg-[#1e293b] p-6 rounded-2xl border border-slate-700 shadow-lg">
            <h3 className="text-lg font-bold mb-4">Riwayat Aktivitas</h3>
            <div className="border-2 border-dashed border-slate-800 rounded-2xl p-12 flex items-center justify-center">
              <p className="text-slate-500 text-sm italic">Belum ada riwayat aktivitas terbaru.</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilPage;