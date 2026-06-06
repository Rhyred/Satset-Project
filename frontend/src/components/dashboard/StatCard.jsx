import { Card } from '../ui/Card'

export function StatCard({ icon: Icon, title, value, helper, tone = 'blue' }) {
  const toneClass = {
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300',
    emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300',
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 dark:text-slate-50">
            {value}
          </p>
          {helper ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{helper}</p> : null}
        </div>
        <div className={`rounded-lg p-3 ${toneClass[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}
