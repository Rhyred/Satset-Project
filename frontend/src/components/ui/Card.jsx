export function Card({ children, className = '' }) {
  return <section className={`surface ${className}`}>{children}</section>
}
