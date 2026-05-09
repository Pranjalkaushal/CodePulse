import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AuthUser = {
  id: string
  fullName?: string
  name?: string
  email?: string
  role?: 'student' | 'teacher' | string
  leetcodeUsername?: string
}

type AuthState = {
  token: string | null
  user: AuthUser | null
  setAuth: (payload: { token: string; user: AuthUser }) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: 'codepulse-auth-v2' },
  ),
)
