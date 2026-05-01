import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Loader } from '../../../components/ui/Loader'
import { useAuthStore } from '../../../app/store/authStore'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-4 pt-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
          Sign in to CodeRank
        </h1>
        <p className="text-sm text-slate-300">
          Track progress, compare performance, and unlock actionable insights across your campus.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-md p-6">
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            const dummyUser = {
              name: 'Demo User',
              email: values.email,
              role: 'student',
            }

            setAuth({ token: 'demo-token', user: dummyUser as any })
            navigate('/student', { replace: true })
          })}
        >
          <Input
            label="Email"
            placeholder="you@college.edu"
            autoComplete="email"
            {...register('email')}
            error={errors.email?.message}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader label="Signing in..." /> : 'Sign in'}
          </Button>

          <p className="text-center text-sm text-slate-300">
            New here?{' '}
            <Link to="/register" className="font-medium text-indigo-300 hover:text-indigo-200">
              Create an account
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}

