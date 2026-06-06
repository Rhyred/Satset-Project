import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Card } from '../components/ui/Card.jsx'
import { EmptyState } from '../components/ui/EmptyState.jsx'
import { LoadingScreen } from '../components/ui/LoadingScreen.jsx'
import { SectionHeader } from '../components/ui/SectionHeader.jsx'
import { StatusBadge } from '../components/ui/StatusBadge.jsx'
import { madingService } from '../services/madingService.js'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { formatDateTime } from '../utils/formatters.js'
import { toArray } from './pageHelpers.js'

const filterLabels = ['SEMUA', 'PENTING', 'INFO_WARGA', 'PENGUMUMAN']

export function MadingPage() {
  useDocumentTitle('Mading Digital')
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('SEMUA')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true

    const loadMading = async () => {
      try {
        const response = await madingService.getPublished()
        if (active) setItems(toArray(response))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadMading()

    return () => {
      active = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    const loweredQuery = searchQuery.trim().toLowerCase()

    return items.filter((item) => {
      const matchesFilter = filter === 'SEMUA' || item.jenisInformasi === filter
      const matchesQuery =
        !loweredQuery ||
        String(item.judul || item.title || '').toLowerCase().includes(loweredQuery) ||
        String(item.konten || item.deskripsi || '').toLowerCase().includes(loweredQuery)

      return matchesFilter && matchesQuery
    })
  }, [filter, items, searchQuery])

  if (loading) {
    return <LoadingScreen label="Memuat mading..." />
  }

  return (
    <div className="page-section">
      <SectionHeader
        eyebrow="Informasi publik"
        title="Mading digital"
        description="Pengumuman, informasi warga, dan kabar penting dari admin."
      />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterLabels.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setFilter(label)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === label ? 'bg-primary-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'}`}
            >
              {label.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            className="field-input pl-9"
            placeholder="Cari judul atau isi mading"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredItems.length ? (
          filteredItems.map((item) => (
            <Card key={item.id} className={`overflow-hidden p-0 ${item.jenisInformasi === 'PENTING' ? 'border-rose-200 dark:border-rose-900' : ''}`}>
              <div className={`h-1 ${item.jenisInformasi === 'PENTING' ? 'bg-rose-500' : 'bg-primary-600'}`} />
              <div className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={item.jenisInformasi} />
                      <span className="text-xs text-slate-400 dark:text-slate-500">{formatDateTime(item.createdAt)}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
                      {item.judul || item.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-500 dark:text-slate-400">
                  {item.konten || item.deskripsi}
                </p>
              </div>
            </Card>
          ))
        ) : (
          <EmptyState title="Tidak ada mading yang cocok" description="Coba ubah filter atau kata kunci pencarian Anda." />
        )}
      </div>
    </div>
  )
}