import { Plus, RefreshCcw, MessageSquareWarning } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { reportService } from '../services/reportService.js'
import { queueService } from '../services/queueService.js'
import { getErrorMessage } from '../services/api.js'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { SectionHeader } from '../components/ui/SectionHeader.jsx'
import { StatusBadge } from '../components/ui/StatusBadge.jsx'
import { FollowUpTimeline } from '../components/reports/FollowUpTimeline.jsx'
import { getInitials, formatDateTime } from '../utils/formatters.js'
import { pickValue, toArray } from './pageHelpers.js'

const initialReport = {
  judulLaporan: '',
  deskripsi: '',
  kategoriId: null,
  userId: null,
}

function ReportCard({ report, followUps = [] }) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
            {pickValue(report, ['judulLaporan', 'judul', 'title'])}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {pickValue(report, ['deskripsi', 'konten', 'description'])}
          </p>
        </div>
        <StatusBadge status={pickValue(report, ['status', 'statusLaporan'], 'DITERIMA')} />
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400 dark:text-slate-500">
        <span>{formatDateTime(pickValue(report, ['createdAt', 'tanggal', 'waktu'], ''))}</span>
        <span>#{pickValue(report, ['id'], '-')}</span>
      </div>
      <FollowUpTimeline items={followUps} />
    </Card>
  )
}

export function ReportsPage() {
  useDocumentTitle('Pengaduan')
  const { user } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('community')
  const [showModal, setShowModal] = useState(false)
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [followUps, setFollowUps] = useState([])
  const [newReport, setNewReport] = useState(initialReport)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const [reportsData, categoriesData, followUpData] = await Promise.all([
          reportService.getAllReports(),
          queueService.getCategories(),
          reportService.getFollowUps(),
        ])

        if (!active) return

        const categoryList = toArray(categoriesData)
        setReports(toArray(reportsData))
        setCategories(categoryList)
        setFollowUps(toArray(followUpData))
        setNewReport((current) => ({
          ...current,
          userId: user?.id ?? null,
          kategoriId: current.kategoriId ?? categoryList[0]?.id ?? null,
        }))
      } catch (error) {
        if (active) {
          addToast({ tone: 'error', title: 'Gagal memuat laporan', description: getErrorMessage(error) })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [addToast, user?.id])

  const myReports = useMemo(() => reports.filter((report) => report.userId === user?.id), [reports, user?.id])
  const visibleReports = activeTab === 'mine' ? myReports : reports

  const refreshReports = async () => {
    try {
      const [reportData, followUpData] = await Promise.all([
        reportService.getAllReports(),
        reportService.getFollowUps(),
      ])

      setReports(toArray(reportData))
      setFollowUps(toArray(followUpData))
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal memuat ulang laporan', description: getErrorMessage(error) })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!newReport.judulLaporan || !newReport.deskripsi || !newReport.kategoriId) {
      addToast({ tone: 'error', title: 'Form belum lengkap', description: 'Lengkapi seluruh data laporan.' })
      return
    }

    setSubmitting(true)

    try {
      await reportService.createReport({ ...newReport, userId: user?.id ?? newReport.userId })
      addToast({ tone: 'success', title: 'Laporan berhasil dikirim' })
      setShowModal(false)
      setActiveTab('mine')
      setNewReport((current) => ({
        ...current,
        judulLaporan: '',
        deskripsi: '',
        kategoriId: categories[0]?.id || null,
      }))
      await refreshReports()
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal mengirim laporan', description: getErrorMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingScreen label="Memuat laporan..." />
  }

  return (
    <div className="page-section">
      <SectionHeader
        eyebrow="Pengaduan warga"
        title="Laporan dan tindak lanjut"
        description="Buat laporan baru atau pantau feed komunitas dan progres penyelesaiannya."
        actions={
          <>
            <Button variant="secondary" onClick={refreshReports}>
              <RefreshCcw className="h-4 w-4" />
              Muat ulang
            </Button>
            <Button onClick={() => setShowModal(true)}>
              <Plus className="h-4 w-4" />
              Laporan baru
            </Button>
          </>
        }
      />

      <div className="flex gap-3 border-b border-slate-200 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('mine')}
          className={`border-b-2 px-1 py-3 text-sm font-medium transition ${activeTab === 'mine' ? 'border-primary-600 text-primary-700 dark:text-primary-300' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}`}
        >
          Laporan saya
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('community')}
          className={`border-b-2 px-1 py-3 text-sm font-medium transition ${activeTab === 'community' ? 'border-primary-600 text-primary-700 dark:text-primary-300' : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'}`}
        >
          Community feed
        </button>
      </div>

      <div className="space-y-4">
        {visibleReports.length ? (
          visibleReports.map((report) => {
            const relatedFollowUps = followUps.filter((item) => item.laporanId === report.id)
            return <ReportCard key={report.id} report={report} followUps={relatedFollowUps} />
          })
        ) : (
          <EmptyState
            icon={MessageSquareWarning}
            title="Belum ada laporan"
            description="Saat Anda atau warga lain mengirim laporan, data akan tampil di sini."
          />
        )}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title="Buat laporan baru" width="max-w-2xl">
        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          <div>
            <label className="field-label">Kategori layanan</label>
            <select
              className="field-input"
              value={newReport.kategoriId ?? ''}
              onChange={(event) =>
                setNewReport((current) => ({ ...current, kategoriId: Number(event.target.value) }))
              }
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nama}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="field-label">Judul laporan</label>
            <input
              className="field-input"
              value={newReport.judulLaporan}
              onChange={(event) => setNewReport((current) => ({ ...current, judulLaporan: event.target.value }))}
              placeholder="Misal: Jalan berlubang di depan pasar"
            />
          </div>

          <div>
            <label className="field-label">Deskripsi detail</label>
            <textarea
              rows="4"
              className="field-input min-h-32 resize-y"
              value={newReport.deskripsi}
              onChange={(event) => setNewReport((current) => ({ ...current, deskripsi: event.target.value }))}
              placeholder="Ceritakan detail masalah, lokasi akurat, dan kondisi saat ini..."
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Mengirim...' : 'Kirim laporan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
