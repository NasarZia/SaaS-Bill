'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Building2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { setUser, setToken, setLoading, setError, clearError } = useAuthStore()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLocalError('')
    clearError()

    try {
      const response = await api.post('/auth/login', { email, password })
      const { user, token } = response.data

      setUser(user)
      setToken(token)
      setLoading(false)

      router.push('/dashboard')
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.'
      setLocalError(message)
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-8">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">SaaS Bill</h1>
            <p className="text-sm text-muted-foreground">GST Invoicing Made Simple</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-10 text-base md:text-sm"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-10 pr-10 text-base md:text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {localError && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {localError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-10 w-full text-base md:text-sm md:h-9"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Signup Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="rounded-lg border border-dashed bg-muted/30 p-3 text-xs text-muted-foreground">
          <p className="font-semibold mb-1">Demo Credentials:</p>
          <p>Email: demo@example.com</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  )
}
