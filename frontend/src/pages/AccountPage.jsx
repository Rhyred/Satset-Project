import { Edit3, LogOut, RefreshCcw, Save, ShieldCheck } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { SectionHeader } from '../components/ui/SectionHeader.jsx'
import { StatusBadge } from '../components/ui/StatusBadge.jsx'
import { authService } from '../services/authService.js'
import { queueService } from '../services/queueService.js'
import { reportService } from '../services/reportService.js'
import { userService } from '../services/userService.js'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { getErrorMessage } from '../services/api.js'
import { formatDateTime, getInitials } from '../utils/formatters.js'
import { pickValue, toArray } from './pageHelpers.js'

export function AccountPage() {
  useDocumentTitle('Profil Warga')
  const { user, setUser } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [antreans, setAntreans] = useState([])
  const [laporans, setLaporans] = useState([])
  const [editData, setEditData] = useState({})

  useEffect(() => {
    let active = true

    const loadActivity = async () => {
      try {
        const [queueData, reportData] = await Promise.all([queueService.getMyQueues(), reportService.getMyReports()])
        if (!active) return

        setAntreans(toArray(queueData))
        setLaporans(toArray(reportData))
        setEditData({
          namaLengkap: user?.namaLengkap || '',
          nik: user?.nik || '',
          email: user?.email || '',
          noTelepon: user?.noTelepon || '',
          alamat: user?.alamat || '',
        })
      } catch (error) {
        if (active) {
          addToast({ tone: 'error', title: 'Gagal memuat profil', description: getErrorMessage(error) })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadActivity()

    return () => {
      active = false
    }
  }, [addToast, user])

  const activityItems = useMemo(() => {
    const queueItems = antreans.slice(0, 3).map((item) => ({
      id: `queue-${item.id}`,
      title: pickValue(item, ['nomorAntrian', 'kodeAntrian', 'jenisSurat']),
      description: pickValue(item, ['jenisSurat', 'keperluan']),
      status: pickValue(item, ['statusAntrian', 'status'], 'MENUNGGU'),
      date: item.createdAt,
    }))
    const reportItems = laporans.slice(0, 3).map((item) => ({
      id: `report-${item.id}`,
      title: pickValue(item, ['judulLaporan', 'judul', 'title']),
      description: pickValue(item, ['deskripsi', 'konten', 'description']),
      status: pickValue(item, ['statusLaporan', 'status'], 'DITERIMA'),
      date: item.createdAt,
    }))

    return [...queueItems, ...reportItems].sort((left, right) => new Date(right.date) - new Date(left.date))
  }, [antreans, laporans])

  const openEditModal = () => {
    setEditData({
      namaLengkap: user?.namaLengkap || '',
      nik: user?.nik || '',
      email: user?.email || '',
      noTelepon: user?.noTelepon || '',
      alamat: user?.alamat || '',
    })
    setShowEditModal(true)
  }

  const saveProfile = async () => {
    if (!editData.namaLengkap) {
      addToast({ tone: 'error', title: 'Nama wajib diisi' })
      return
    }

    setSaving(true)

    try {
      const response = await userService.updateUser(user.id, editData)
      const updatedUser = response?.data ?? response
      setUser(updatedUser)
      setShowEditModal(false)
      addToast({ tone: 'success', title: 'Profil berhasil disimpan' })
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal menyimpan profil', description: getErrorMessage(error) })
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      setUser(null)
      window.location.assign('/login')
    } catch (error) {
      addToast({ tone: 'error', title: 'Logout gagal', description: getErrorMessage(error) })
    }
  }

  if (loading) {
    return <LoadingScreen label="Memuat profil..." />
  }

  return (
    <div className="page-section">
      <SectionHeader
        eyebrow="Profil warga"
        title="Akun dan aktivitas Anda"
        description="Lihat data diri, antrean aktif, dan laporan yang pernah Anda kirim."
        actions={
          <>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              <RefreshCcw className="h-4 w-4" />
              Muat ulang
            </Button>
            <Button onClick={openEditModal}>
              <Edit3 className="h-4 w-4" />
              Edit profil
            </Button>
            <Button variant="danger" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary-700 via-sky-600 to-primary-500" />
        <div className="relative px-6 pb-6 pt-0 sm:px-8">
          <div className="-mt-10 inline-flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-primary-700 text-2xl font-semibold text-white shadow-soft dark:border-slate-900">
            {getInitials(user?.namaLengkap)}
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                {user?.namaLengkap}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">NIK: {user?.nik || '-'}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Akun aktif
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'Email', value: user?.email },
              { label: 'No. Telepon', value: user?.noTelepon },
              { label: 'Alamat', value: user?.alamat },
              { label: 'Peran', value: user?.role },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{item.value || '-'}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <SectionHeader eyebrow="Riwayat" title="Antrean terbaru" />
          <div className="mt-6 space-y-3">
            {antreans.length ? (
              antreans.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        {pickValue(item, ['nomorAntrian', 'kodeAntrian', 'jenisSurat'])}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {pickValue(item, ['jenisSurat', 'keperluan'])}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
                    </div>
                    <StatusBadge status={pickValue(item, ['statusAntrian', 'status'], 'MENUNGGU')} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="Belum ada antrean" description="Antrean yang Anda ajukan akan tampil di sini." />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <SectionHeader eyebrow="Riwayat" title="Laporan terbaru" />
          <div className="mt-6 space-y-3">
            {laporans.length ? (
              laporans.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                        {pickValue(item, ['judulLaporan', 'judul', 'title'])}
                      </p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {pickValue(item, ['deskripsi', 'konten', 'description'])}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">{formatDateTime(item.createdAt)}</p>
                    </div>
                    <StatusBadge status={pickValue(item, ['statusLaporan', 'status'], 'DITERIMA')} />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="Belum ada laporan" description="Laporan yang Anda kirim akan tampil di sini." />
            )}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <SectionHeader eyebrow="Aktivitas" title="Ringkasan terbaru" />
        <div className="mt-6 space-y-3">
          {activityItems.length ? (
            activityItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">{item.title}</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
                    <p className="mt-2 text-xs text-slate-400">{formatDateTime(item.date)}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            ))
          ) : (
            <EmptyState title="Belum ada aktivitas" description="Aktivitas akun Anda akan tampil di sini." />
          )}
        </div>
      </Card>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit profil" width="max-w-2xl">
        <div className="space-y-4 p-5">
          {['namaLengkap', 'nik', 'email', 'noTelepon', 'alamat'].map((field) => (
            <div key={field}>
              <label className="field-label">{field}</label>
              <input
                className="field-input"
                value={editData[field] || ''}
                onChange={(event) => setEditData((current) => ({ ...current, [field]: event.target.value }))}
              />
            </div>
          ))}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button onClick={saveProfile} disabled={saving}>
              <Save className="h-4 w-4" />
              {saving ? 'Menyimpan...' : 'Simpan perubahan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}