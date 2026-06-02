import { formatDateTime } from '../../utils/formatters'

export function FollowUpTimeline({ items }) {
  if (!items?.length) return null

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        Riwayat tindak lanjut
      </p>
      <div className="mt-4 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="relative pl-5">
            <span className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-primary-600" />
            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.catatanAdmin}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatDateTime(item.waktuTindak)}</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Oleh {item.admin?.namaLengkap || 'Petugas SatSet'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
