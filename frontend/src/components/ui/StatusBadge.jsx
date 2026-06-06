import { statusTone, toTitleStatus } from '../../utils/formatters'

export function StatusBadge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(status)} ${className}`}
    >
      {toTitleStatus(status)}
    </span>
  )
}
