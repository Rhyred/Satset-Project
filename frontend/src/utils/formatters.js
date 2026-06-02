const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

export function formatDateTime(value) {
  if (!value) return '-'
  return dateTimeFormatter.format(new Date(value))
}

export function formatDate(value) {
  if (!value) return '-'
  return dateFormatter.format(new Date(value))
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'SS'
}

export function statusTone(status = '') {
  const normalized = status.toUpperCase()
  const tones = {
    DITERIMA: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    DIPROSES: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    MENUNGGU: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    DIPANGGIL: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
    DILAYANI: 'bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300',
    SELESAI: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    DITOLAK: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    PENTING: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    INFO_WARGA: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
    PENGUMUMAN: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    ADMIN: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300',
    USER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
  }

  return tones[normalized] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
}

export function toTitleStatus(value = '') {
  return value.replace(/_/g, ' ')
}
