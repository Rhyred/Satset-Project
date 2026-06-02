import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToast } from '../../hooks/useToast'

const toneConfig = {
  success: {
    icon: CheckCircle2,
    ring: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-100',
  },
  error: {
    icon: AlertCircle,
    ring: 'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/80 dark:text-rose-100',
  },
  info: {
    icon: Info,
    ring: 'border-slate-200 bg-white text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50',
  },
}

export function ToastViewport() {
  const { toasts, removeToast } = useToast()

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const config = toneConfig[toast.tone] ?? toneConfig.info
        const Icon = config.icon

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto animate-slide-up rounded-lg border p-4 shadow-soft ${config.ring}`}
          >
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm opacity-80">{toast.description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="rounded-md p-1 text-current/60 transition hover:bg-black/5 hover:text-current dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
