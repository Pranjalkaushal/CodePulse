import { Outlet, Link } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-slate-950 via-slate-950 to-indigo-950/30">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Link to="/login" className="text-lg font-semibold tracking-tight text-slate-100">
          CodeRank
        </Link>
        <div className="text-xs text-slate-400">Campus coding analytics platform</div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-10">
        <Outlet />
      </main>
    </div>
  )
}

