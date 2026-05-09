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
import { useState } from 'react'
import {
  sendOtp,
  signup,
  verifyOtp,
} from '../services/authApi'

/* -------------------------
   VALIDATION SCHEMA
-------------------------- */

const schema = z
  .object({
    fullName: z.string().min(1, 'Enter your name'),

    email: z.string().email('Enter a valid email'),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters'),

    confirmPassword: z
      .string()
      .min(6, 'Confirm your password'),

    role: z.enum(['student', 'teacher']),

    leetcodeUsername: z.string().optional(),

    otp: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) =>
      data.role === 'teacher' ||
      Boolean(data.leetcodeUsername?.trim()),
    {
      message: 'LeetCode username is required for students',
      path: ['leetcodeUsername'],
    }
  )

type FormValues = z.infer<typeof schema>

/* -------------------------
   COMPONENT
-------------------------- */

export function RegisterPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [otpSent, setOtpSent] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'student',
    },
  })

  const role = watch('role')

  /* -------------------------
     STEP 1: SEND OTP
  -------------------------- */

  const handleSendOtp = async (values: FormValues) => {
    setError(null)
    setSuccess(null)

    try {
      await sendOtp({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
        leetcodeUsername:
          values.role === 'student'
            ? values.leetcodeUsername
            : undefined,
      })

      setOtpSent(true)
      setSuccess('OTP sent to your email')
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Failed to send OTP'
      )
    }
  }

  /* -------------------------
     STEP 2: VERIFY + SIGNUP
  -------------------------- */

  const handleVerifyAndSignup = async (
    values: FormValues
  ) => {
    setError(null)
    setSuccess(null)

    try {
      if (!values.otp) {
        setError('Please enter OTP')
        return
      }

      // verify otp
      await verifyOtp({
        email: values.email,
        otp: values.otp,
      })

      // final signup
      const session = await signup({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
        leetcodeUsername:
          values.role === 'student'
            ? values.leetcodeUsername
            : undefined,
        otp: values.otp,
      })

      setAuth(session)

      navigate(
        values.role === 'teacher'
          ? '/teacher'
          : '/student',
        { replace: true }
      )
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Registration failed'
      )
    }
  }

  /* -------------------------
     UI
  -------------------------- */

  return (
    <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-5 lg:items-start lg:gap-12">

      {/* LEFT SIDE */}
      <div className="space-y-4 lg:col-span-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Create an account
        </h1>

        <p className="text-sm text-slate-600">
          OTP-based verification with role-based access.
        </p>
      </div>

      {/* FORM */}
      <Card className="lg:col-span-3">
        <h2 className="text-lg font-semibold text-slate-900">
          Get started
        </h2>

        <form className="mt-6 space-y-4">

          {/* NAME */}
          <Input
            label="Full Name"
            {...register('fullName')}
            error={errors.fullName?.message}
          />

          {/* EMAIL */}
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />

          {/* ROLE */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-900">
              Role
            </label>

            <select
              className="w-full rounded-lg border px-3 py-2 text-sm text-slate-900"
              {...register('role')}
            >
              <option value="student">
                Student
              </option>
              <option value="teacher">
                Teacher
              </option>
            </select>
          </div>

          {/* LEETCODE (ONLY STUDENT) */}
          {role === 'student' && (
            <Input
              label="LeetCode Username"
              {...register('leetcodeUsername')}
              error={
                errors.leetcodeUsername?.message
              }
            />
          )}

          {/* PASSWORD */}
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />

          {/* CONFIRM PASSWORD */}
          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword')}
            error={
              errors.confirmPassword?.message
            }
          />

          {/* STEP 1 BUTTON */}
          {!otpSent && (
            <Button
              type="button"
              className="w-full"
              disabled={isSubmitting}
              onClick={handleSubmit(handleSendOtp)}
            >
              {isSubmitting
                ? 'Sending OTP...'
                : 'Generate OTP'}
            </Button>
          )}

          {/* OTP INPUT */}
          {otpSent && (
            <>
              <Input
                label="Enter OTP"
                {...register('otp')}
                error={errors.otp?.message}
              />

              {/* STEP 2 BUTTON */}
              <Button
                type="button"
                className="w-full"
                disabled={isSubmitting}
                onClick={handleSubmit(
                  handleVerifyAndSignup
                )}
              >
                {isSubmitting
                  ? 'Creating account...'
                  : 'Verify & Create Account'}
              </Button>
            </>
          )}

          {/* ALERTS */}
          {error && (
            <Alert
              title="Error"
              description={error}
            />
          )}

          {success && (
            <Alert
              title="Success"
              description={success}
            />
          )}

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-blue-600 underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </Card>
    </div>
  )
}