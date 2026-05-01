import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../app/store/authStore'
import { Button } from '../components/ui/Button'
import { cn } from '../utils/cn'
import { tourSteps } from '../app/tour/tourConfig'
import { getTourSearch, parseTourStep } from '../app/tour/tourUrl'

const nav = [
  { to: '/student', label: 'Student' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teacher', label: 'Teacher' },
  { to: '/mentorship', label: 'Mentorship' },
]

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { enabled: tourEnabled, step: tourStep } = parseTourStep(location.search)

  const navButtonClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      'inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition',
      'border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-900 hover:text-slate-100',
      'focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 focus:ring-offset-slate-950',
      isActive && 'border-indigo-500/60 bg-indigo-600/15 text-slate-50',
    )

  return (
    <div className="min-h-dvh bg-slate-950">
      <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-6">
            <div className="text-lg font-semibold tracking-tight text-slate-100">CodeRank</div>
            <nav className="hidden items-center gap-2 md:flex">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  className={navButtonClass}
                >
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <Button
                variant="secondary"
                type="button"
                aria-expanded={mobileOpen}
                onClick={() => setMobileOpen((v) => !v)}
              >
                Menu
              </Button>
            </div>
            <div className="hidden text-sm text-slate-300 sm:block">
              {user?.name ?? user?.email ?? user?.id ?? 'Signed in'}
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                clearAuth()
                navigate('/login')
              }}
            >
              Sign out
            </Button>
          </div>
        </div>

        {mobileOpen ? (
          <div className="border-t border-slate-800 md:hidden">
            <nav className="mx-auto max-w-6xl px-4 py-3">
              <div className="flex flex-wrap gap-2">
                {nav.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    onClick={() => setMobileOpen(false)}
                    className={navButtonClass}
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
            </nav>
          </div>
        ) : null}

        {tourEnabled ? (
          <div className="border-t border-slate-800 bg-slate-950/70">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2">
              <div className="text-sm text-slate-200">
                Tour: <span className="font-medium">{tourSteps[tourStep]?.label ?? 'Page'}</span>{' '}
                <span className="text-slate-400">
                  ({Math.min(tourStep + 1, tourSteps.length)}/{tourSteps.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  type="button"
                  disabled={tourStep <= 0}
                  onClick={() => {
                    const next = Math.max(0, tourStep - 1)
                    const target = tourSteps[next]?.path ?? '/student'
                    navigate(`${target}${getTourSearch(next)}`)
                  }}
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={() => {
                    const next = Math.min(tourStep + 1, tourSteps.length - 1)
                    const target = tourSteps[next]?.path ?? '/student'
                    navigate(`${target}${getTourSearch(next)}`)
                  }}
                >
                  {tourStep >= tourSteps.length - 1 ? 'Finish' : 'Next'}
                </Button>
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    const base = tourSteps[tourStep]?.path ?? '/student'
                    navigate(base)
                  }}
                >
                  Exit tour
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}

