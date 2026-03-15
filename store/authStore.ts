import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  gstin?: string
  businessName?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  error: string | null

  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  logout: () => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (typeof document !== 'undefined') {
          if (token) document.cookie = `auth-token=${encodeURIComponent(token)}; path=/; max-age=604800`
          else document.cookie = 'auth-token=; path=/; max-age=0'
        }
        set({ token })
      },
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      logout: () => {
        if (typeof document !== 'undefined') document.cookie = 'auth-token=; path=/; max-age=0'
        set({
          user: null,
          token: null,
          error: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && typeof document !== 'undefined') {
          document.cookie = `auth-token=${encodeURIComponent(state.token)}; path=/; max-age=604800`
        }
      },
    }
  )
)
