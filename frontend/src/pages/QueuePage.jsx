import { ArrowRight, CalendarDays, ClipboardList, RefreshCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth.js'
import { useToast } from '../hooks/useToast.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { queueService } from '../services/queueService.js'
import { getErrorMessage } from '../services/api.js'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx'
import { SectionHeader } from '../components/ui/SectionHeader.jsx'
import { StatusBadge } from '../components/ui/StatusBadge.jsx'
import { pickValue, toArray } from './pageHelpers.js'

const initialForm = {
  selectedType: '',
  keperluan: '',
  waktuPengajuan: '',
}

export function QueuePage() {
  useDocumentTitle('Antrean')
  const { user } = useAuth()
  const { addToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [categories, setCategories] = useState([])
  const [queues, setQueues] = useState([])
  const [ticketResult, setTicketResult] = useState(null)
  const [form, setForm] = useState(initialForm)

  const selectedCategory = useMemo(
    () => categories.find((category) => category.nama === form.selectedType) || null,
    [categories, form.selectedType],
  )

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const [categoryData, queueData] = await Promise.all([
          queueService.getCategories(),
          queueService.getMyQueues(),
        ])

        if (!active) return

        const normalizedCategories = toArray(categoryData)
        setCategories(normalizedCategories)
        setQueues(toArray(queueData))
        setForm((current) => ({
          ...current,
          selectedType: current.selectedType || normalizedCategories[0]?.nama || '',
        }))
      } catch (error) {
        if (active) {
          addToast({ tone: 'error', title: 'Gagal memuat antrean', description: getErrorMessage(error) })
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [addToast])

  const refreshQueues = async () => {
    try {
      const queueData = await queueService.getMyQueues()
      setQueues(toArray(queueData))
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal memuat ulang antrean', description: getErrorMessage(error) })
    }
  }

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!form.selectedType || !form.keperluan || !form.waktuPengajuan) {
      addToast({ tone: 'error', title: 'Data belum lengkap', description: 'Pilih layanan dan lengkapi data pengajuan.' })
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        jenisSurat: `${form.selectedType} - ${form.keperluan}`,
        statusAntrian: 'MENUNGGU',
        userId: user?.id,
        kategoriId: selectedCategory?.id ?? categories[0]?.id ?? null,
        waktuPengajuan: form.waktuPengajuan,
        keperluan: form.keperluan,
      }

      const response = await queueService.createQueue(payload)
      const ticket = response?.data ?? response
      setTicketResult(ticket)
      addToast({ tone: 'success', title: 'Antrean berhasil diajukan' })
      setForm((current) => ({ ...current, keperluan: '', waktuPengajuan: '' }))
      await refreshQueues()
    } catch (error) {
      addToast({ tone: 'error', title: 'Gagal mengajukan antrean', description: getErrorMessage(error) })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingScreen label="Memuat antrean..." />
  }

  return (
    <div className="page-section">
      <SectionHeader
        eyebrow="Layanan antrean"
        title="Ambil nomor antrean"
        description="Pilih layanan, lengkapi kebutuhan, lalu ajukan antrean digital Anda."
        actions={
          <Button variant="secondary" onClick={refreshQueues}>
            <RefreshCcw className="h-4 w-4" />
            Muat ulang
          </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="rounded-2xl bg-slate-950 p-5 text-slate-50 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">Tahapan</p>
              <div className="mt-5 space-y-3 text-sm text-slate-300">
                {['Pilih layanan', 'Lengkapi data', 'Terbitkan tiket'].map((label, index) => (
                  <div key={label} className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        index === 0 ? 'bg-white text-slate-950' : 'bg-white/10'
                      }`}
                    >
                      {index + 1}
                    </span>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="field-label">Jenis Layanan</label>
                <select
                  className="field-input"
                  value={form.selectedType}
                  onChange={updateField('selectedType')}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.nama}>
                      {category.nama}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">Keperluan</label>
                <input
                  className="field-input"
                  placeholder="Contoh: Perpanjangan KTP"
                  value={form.keperluan}
                  onChange={updateField('keperluan')}
                />
              </div>

              <div>
                <label className="field-label">Tanggal Pengajuan</label>
                <input
                  type="date"
                  className="field-input"
                  value={form.waktuPengajuan}
                  onChange={updateField('waktuPengajuan')}
                />
              </div>

              <Button type="submit" className="w-full justify-center" disabled={submitting}>
                {submitting ? 'Mengirim...' : 'Ajukan antrean'}
                {!submitting ? <ArrowRight className="h-4 w-4" /> : null}
              </Button>
            </form>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <SectionHeader
              eyebrow="Nomor tiket"
              title="Hasil pengajuan terakhir"
              description="Informasi ini akan terisi setelah antrean berhasil dibuat."
            />
            {ticketResult ? (
              <div className="mt-6 rounded-2xl border border-dashed border-primary-200 bg-primary-50 p-5 dark:border-primary-900 dark:bg-primary-950/40">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-700 dark:text-primary-300">
                  Tiket antrean
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                  {pickValue(ticketResult, ['nomorAntrian', 'kodeAntrian', 'id'])}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  {pickValue(ticketResult, ['jenisSurat', 'keperluan'])}
                </p>
              </div>
            ) : (
              <EmptyState
                icon={ClipboardList}
                title="Belum ada tiket baru"
                description="Ajukan antrean untuk melihat nomor tiket di sini."
              />
            )}
          </Card>

          <Card className="p-6">
            <SectionHeader
              eyebrow="Antrean saya"
              title="Riwayat antrean"
              description="Daftar antrean yang pernah Anda ajukan."
            />
            <div className="mt-6 space-y-3">
              {queues.length > 0 ? (
                queues.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950 dark:text-slate-50">
                          {pickValue(item, ['nomorAntrian', 'kodeAntrian', 'jenisSurat'])}
                        </p>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {pickValue(item, ['jenisSurat', 'keperluan'])}
                        </p>
                        <p className="mt-2 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {pickValue(item, ['createdAt', 'waktuPengajuan'])}
                        </p>
                      </div>
                      <StatusBadge status={pickValue(item, ['statusAntrian', 'status'], 'MENUNGGU')} />
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="Belum ada antrean"
                  description="Riwayat antrean Anda akan muncul setelah pengajuan pertama."
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
