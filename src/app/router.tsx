import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AuthLayout } from '../layouts/AuthLayout'
import { AppLayout } from '../layouts/AppLayout'
import { RequireAuth } from './routing/RequireAuth'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { RegisterPage } from '../features/auth/pages/RegisterPage'
import { StudentDashboardPage } from '../features/student/pages/StudentDashboardPage'
import { LeaderboardPage } from '../features/leaderboard/pages/LeaderboardPage'
import { TeacherDashboardPage } from '../features/teacher/pages/TeacherDashboardPage'
import { MentorshipPage } from '../features/mentorship/pages/MentorshipPage'
import { useAuthStore } from './store/authStore'

function RoleHomeRedirect() {
  const role = useAuthStore((s) => s.user?.role)
  return <Navigate to={role === 'teacher' ? '/teacher' : '/student'} replace />
}

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <RoleHomeRedirect /> },
      { path: '/student', element: <StudentDashboardPage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },
      { path: '/teacher', element: <TeacherDashboardPage /> },
      { path: '/mentorship', element: <MentorshipPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

