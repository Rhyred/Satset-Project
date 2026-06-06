import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '../ui/Card'

export function QuickActionCard({ to, icon: Icon, title, description, tone = 'blue' }) {
  const toneClass = {
    blue: 'text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-950/70',
    amber: 'text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/70',
    emerald: 'text-emerald-700 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/70',
  }

  return (
    <Card className="overflow-hidden p-0">
      <Link
        to={to}
        className="flex h-full flex-col gap-5 p-5 transition hover:bg-slate-50 dark:hover:bg-slate-800/60"
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${toneClass[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 dark:text-primary-300">
          Buka halaman
          <ArrowRight className="h-4 w-4" />
        </span>
      </Link>
    </Card>
  )
}
