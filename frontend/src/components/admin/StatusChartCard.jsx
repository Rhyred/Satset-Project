import { Card } from '../ui/Card'

export function StatusChartCard({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="p-5">
      <h3 className="text-base font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
      <div className="mt-5 space-y-4">
        {items.map((item) => {
          const width = total ? Math.max((item.value / total) * 100, 4) : 0

          return (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
                <span className="font-semibold text-slate-900 dark:text-slate-50">{item.value}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800">
                <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${width}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
