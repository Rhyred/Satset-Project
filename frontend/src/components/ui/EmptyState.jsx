export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="surface-muted flex flex-col items-center justify-center px-6 py-14 text-center">
      {Icon ? (
        <div className="mb-4 rounded-full bg-slate-200 p-4 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          <Icon className="h-7 w-7" />
        </div>
      ) : null}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
