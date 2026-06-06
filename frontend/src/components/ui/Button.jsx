export function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) {
  const variantClass = {
    primary:
      'bg-primary-700 text-white hover:bg-primary-600 focus:ring-primary-200 dark:bg-primary-600 dark:hover:bg-primary-500',
    secondary:
      'bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
    ghost:
      'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-200 dark:text-slate-200 dark:hover:bg-slate-800',
    danger:
      'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-200 dark:bg-rose-600 dark:hover:bg-rose-500',
  }

  const sizeClass = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-sm',
    icon: 'h-10 w-10 justify-center p-0',
  }

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variantClass[variant]} ${sizeClass[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
