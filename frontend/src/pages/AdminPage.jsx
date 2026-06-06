import { BarChart3, ClipboardList, Newspaper, ShieldCheck, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card } from '../components/ui/Card.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx'
import { SectionHeader } from '../components/ui/SectionHeader.jsx'
import { StatCard } from '../components/dashboard/StatCard.jsx'
import { dashboardService } from '../services/dashboardService.js'
import { reportService } from '../services/reportService.js'
import { queueService } from '../services/queueService.js'
import { userService } from '../services/userService.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { toArray, toObject, humanizeKey } from './pageHelpers.js'

export function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({ reports: [], queues: [], users: [], stats: {} })

  useDocumentTitle('Panel Admin')

  useEffect(() => {
    let active = true

    const loadAdminData = async () => {
      try {
        const [statsData, reportsData, queuesData, usersData] = await Promise.all([
          dashboardService.getStats(),
          reportService.getAllReports(),
          queueService.getAllQueues(),
          userService.getUsers(),
        ])

        if (!active) return

        setSummary({
          stats: toObject(statsData),
          reports: toArray(reportsData),
          queues: toArray(queuesData),
          users: toArray(usersData),
        })
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAdminData()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <LoadingScreen label="Memuat panel admin..." />
  }

  const statCards = Object.entries(summary.stats).slice(0, 4)
  const visibleStats = statCards.length
    ? statCards.map(([key, value]) => ({
        title: humanizeKey(key),
        value,
        helper: 'Data dari server',
        icon: BarChart3,
        tone: 'blue',
      }))
    : [
        { title: 'Pengguna', value: summary.users.length, helper: 'Total user', icon: Users, tone: 'blue' },
        { title: 'Laporan', value: summary.reports.length, helper: 'Total laporan', icon: ShieldCheck, tone: 'emerald' },
        { title: 'Antrean', value: summary.queues.length, helper: 'Total antrean', icon: ClipboardList, tone: 'amber' },
        { title: 'Mading', value: 'Live', helper: 'Konten publikasi', icon: Newspaper, tone: 'violet' },
      ]

  return (
    <div className="page-section animate-slide-up">
      <SectionHeader
        eyebrow="Administrasi"
        title="Panel admin"
        description="Ringkasan operasional sistem untuk memantau pengguna, laporan, dan performa layanan."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {visibleStats.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionHeader eyebrow="Akses cepat" title="Modul manajemen" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              { title: 'Kelola pengguna', to: '/users', description: 'Tambah dan perbarui akun warga.' },
              { title: 'Laporan masuk', to: '/reports', description: 'Pantau aduan dan tindak lanjut.' },
              { title: 'Antrean layanan', to: '/queue', description: 'Cek status antrean aktif.' },
              { title: 'Mading digital', to: '/mading', description: 'Atur publikasi informasi.' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50 dark:border-slate-800 dark:bg-slate-950/60 dark:hover:border-primary-900 dark:hover:bg-primary-950/30"
              >
                <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{item.title}</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader eyebrow="Status singkat" title="Data terbaru" />
          <div className="mt-6 space-y-3">
            {[
              ['Laporan terbaru', summary.reports[0]],
              ['Antrean terbaru', summary.queues[0]],
              ['Pengguna terbaru', summary.users[0]],
            ].map(([label, item]) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-semibold text-slate-950 dark:text-slate-50">
                  {item?.judulLaporan || item?.nomorAntrian || item?.namaLengkap || 'Belum ada data'}
                </p>
              </div>
            ))}
            {!summary.reports.length && !summary.queues.length && !summary.users.length ? (
              <EmptyState title="Belum ada data" description="Saat modul backend terisi, ringkasan akan tampil di sini." />
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
