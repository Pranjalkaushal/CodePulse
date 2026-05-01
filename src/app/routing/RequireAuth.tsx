import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export function RequireAuth({ children }: PropsWithChildren) {
  const location = useLocation()
  const token = useAuthStore((s) => s.token)

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

