'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/authStore'
import { User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function AppHeader() {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-40 flex h-14 md:h-16 items-center justify-between border-b bg-background px-3 md:px-6 gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-2 h-8 w-8" />
        <Separator orientation="vertical" className="h-6" />
        <h1 className="text-sm font-bold md:text-base truncate">GST Billing</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 md:h-9 md:w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold flex-shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
