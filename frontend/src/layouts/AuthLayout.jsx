export function AuthLayout({ children, aside }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 lg:grid lg:grid-cols-[1.35fr_520px]">
      <section className="relative hidden overflow-hidden border-r border-slate-800 lg:flex lg:flex-col lg:justify-center lg:px-16 xl:px-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.22),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_35%)]" />
        <div className="relative z-10">{aside}</div>
      </section>
      <section className="flex min-h-screen items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </div>
  )
}
