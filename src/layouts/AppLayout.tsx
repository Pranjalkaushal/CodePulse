import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../app/store/authStore'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/Avatar'
import { cn } from '../utils/cn'
import { tourSteps } from '../app/tour/tourConfig'
import { getTourSearch, parseTourStep } from '../app/tour/tourUrl'

const nav = [
  { to: '/student', label: 'Dashboard' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/teacher', label: 'Teacher' },
  { to: '/mentorship', label: 'Topic Experts' },
]

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150',
    isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
  )
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { enabled: tourEnabled, step: tourStep } = parseTourStep(location.search)

  const displayName = user?.fullName ?? user?.name ?? 'Student'
  const displayEmail = user?.email ?? ''

  const closeMobile = () => setMobileOpen(false)

  // Filter nav items for teachers
  const filteredNav = nav.filter((n) => !(user?.role === 'teacher' && n.label === 'Dashboard'))

  return (
    <div className="flex min-h-dvh bg-slate-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-slate-200 px-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white">
            CP
          </span>
          <span className="text-sm font-semibold text-slate-900">CodePulse</span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {filteredNav.map((n) => (
            <NavLink key={n.to} to={n.to} className={navClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-3">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar name={displayName || displayEmail || '?'} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-slate-900">{displayName}</div>
              <div className="truncate text-xs text-slate-500">{displayEmail}</div>
            </div>
          </div>
          <Button
            variant="secondary"
            className="mt-2 w-full"
            onClick={() => {
              clearAuth()
              navigate('/login')
            }}
          >
            Sign out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 md:hidden">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-semibold text-white">
              CP
            </span>
            <span className="text-sm font-semibold text-slate-900">CodePulse</span>
          </div>
          <Button variant="secondary" type="button" className="shrink-0 px-3" onClick={() => setMobileOpen(true)}>
            Menu
          </Button>
        </header>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/25"
              aria-label="Close menu"
              onClick={closeMobile}
            />
            <div className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-slate-200 bg-white shadow-xl">
              <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
                <span className="text-sm font-semibold text-slate-900">Menu</span>
                <button type="button" className="text-sm font-medium text-slate-600 hover:text-slate-900" onClick={closeMobile}>
                  Close
                </button>
              </div>
              <nav className="flex flex-col gap-0.5 p-3">
                {filteredNav.map((n) => (
                  <NavLink key={n.to} to={n.to} className={navClass} onClick={closeMobile}>
                    {n.label}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-auto border-t border-slate-200 p-3">
                <div className="flex items-center gap-3 px-2 py-2">
                  <Avatar name={displayName || displayEmail || '?'} size="sm" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">{displayName}</div>
                    <div className="truncate text-xs text-slate-500">{displayEmail}</div>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="mt-2 w-full"
                  onClick={() => {
                    clearAuth()
                    navigate('/login')
                    closeMobile()
                  }}
                >
                  Sign out
                </Button>
              </div>
            </div>
          </div>
        )}

        {tourEnabled && (
          <div className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <p className="text-sm text-slate-600">
                Tour: <span className="font-medium text-slate-900">{tourSteps[tourStep]?.label ?? 'Page'}</span>{' '}
                <span className="text-slate-500">
                  ({Math.min(tourStep + 1, tourSteps.length)}/{tourSteps.length})
                </span>
              </p>
              <div className="flex flex-wrap items-center gap-2">
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
        )}

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}