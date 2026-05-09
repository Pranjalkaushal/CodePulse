import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Loader } from '../../../components/ui/Loader'
import { Alert } from '../../../components/ui/Alert'
import { useAuthStore } from '../../../app/store/authStore'
import { login } from '../services/authApi'
import { useState } from 'react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  return (
    <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-5 lg:items-start lg:gap-12">
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Sign in</h1>
        <p className="text-sm leading-relaxed text-slate-600">
          Track your real LeetCode practice, rank, and cohort activity with secured backend authentication.
        </p>
      </div>

      <Card className="lg:col-span-3">
        <h2 className="text-lg font-semibold text-slate-900">Welcome back</h2>
        
        <form
          className="mt-6 space-y-4"
          onSubmit={handleSubmit(async (values) => {
            setError(null)
            try {
              const session = await login(values)
              setAuth(session)
              navigate(session.user.role === 'teacher' ? '/teacher' : '/student', { replace: true })
            } catch (e) {
              setError(e instanceof Error ? e.message : 'Login failed')
            }
          })}
        >
          <Input label="Email" type="email" autoComplete="email" {...register('email')} error={errors.email?.message} />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />

          {error ? <Alert title="Sign-in failed" description={error} /> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader label="Signing in…" /> : 'Continue'}
          </Button>

          <p className="text-center text-sm text-slate-600">
            First time?{' '}
            <Link to="/register" className="font-medium text-blue-700 underline-offset-4 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}
