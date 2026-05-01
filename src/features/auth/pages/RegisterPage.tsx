import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { Alert } from '../../../components/ui/Alert'
import { Loader } from '../../../components/ui/Loader'
import { useAuthStore } from '../../../app/store/authStore'
import { getTourSearch } from '../../../app/tour/tourUrl'
import { getErrorMessage } from '../../../utils/apiError'
import { register as registerUser } from '../services/authApi'

const schema = z.object({
  name: z.string().min(1, "Name required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be 6+ chars"),
  leetcodeUsername: z.string().min(1, "LeetCode username required"),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2 lg:gap-10">
      <div className="space-y-4 pt-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl">
          Create your CodeRank account
        </h1>
        <p className="text-sm text-slate-300">
          Register once and start tracking your submissions, streaks, and skill profile.
        </p>
      </div>

      <Card className="mx-auto w-full max-w-md p-6">
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            setError(null)
            try {
              // ✅ FIX: send full values including leetcodeUsername
              const data = await registerUser(values)

              setAuth({ token: data.token, user: data.user })

              navigate(`/student${getTourSearch(0)}`, { replace: true })
            } catch (e) {
              setError(getErrorMessage(e))
            }
          })}
        >
          <Input
            label="Full name"
            placeholder="Your name"
            {...register('name')}
            error={errors.name?.message}
          />

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
            autoComplete="new-password"
            {...register('password')}
            error={errors.password?.message}
          />

          <Input
            label="LeetCode Username"
            placeholder="your_leetcode_username"
            {...register('leetcodeUsername')}
            error={errors.leetcodeUsername?.message}
          />

          {error ? <Alert title="Registration failed" description={error} /> : null}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Loader label="Creating account..." /> : 'Create account'}
          </Button>

          <p className="text-center text-sm text-slate-300">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-300 hover:text-indigo-200">
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}