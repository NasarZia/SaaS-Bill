'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { useAuthStore } from '@/store/authStore'
import { User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

export default function AppHeader() {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-40 flex h-16 md:h-18 items-center justify-between border-b border-border/50 bg-background/95 backdrop-blur-sm px-4 md:px-8 gap-4 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="-ml-2 h-9 w-9" />
        <Separator orientation="vertical" className="h-7" />
        <h1 className="text-lg font-bold md:text-xl truncate text-foreground">GST Billing</h1>
      </div>

      <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-xs font-semibold flex-shrink-0 shadow-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:flex flex-col min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
