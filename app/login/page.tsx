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
      // Backend returns { user, access_token, refresh_token, expires_in } (already unwrapped by interceptor)
      const { user: apiUser, access_token } = response.data
      const user = apiUser ? {
        id: String(apiUser.id),
        name: [apiUser.first_name, apiUser.last_name].filter(Boolean).join(' ') || apiUser.email,
        email: apiUser.email,
        gstin: apiUser.gstin,
        businessName: apiUser.businessName,
      } : null
      setUser(user)
      setToken(access_token)
      setLoading(false)

      router.push('/dashboard')
    } catch (error: any) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.'
      setLocalError(message)
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm space-y-7 relative z-10">
        {/* Logo and Title */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">SaaS Bill</h1>
            <p className="text-sm text-muted-foreground mt-1">GST Invoicing Made Simple</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-semibold text-foreground">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="h-11 text-base md:text-sm rounded-lg border-border/50"
              required
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2.5">
            <Label htmlFor="password" className="text-sm font-semibold text-foreground">
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
                className="h-11 pr-10 text-base md:text-sm rounded-lg border-border/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {localError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3.5 text-sm text-destructive font-medium">
              {localError}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full text-base md:text-sm md:h-10 font-semibold rounded-lg"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        {/* Signup Link */}
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link href="/signup" className="font-semibold text-primary hover:text-primary/90 transition-colors duration-200">
            Sign up
          </Link>
        </div>

        {/* Demo Credentials */}
        <div className="rounded-lg border border-border/50 bg-card/50 p-4 text-xs text-muted-foreground backdrop-blur-sm">
          <p className="font-semibold mb-2 text-foreground">Demo Credentials:</p>
          <div className="space-y-1 font-mono text-xs">
            <p>Email: demo@example.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
