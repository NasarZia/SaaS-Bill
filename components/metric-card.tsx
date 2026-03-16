import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    direction: 'up' | 'down'
  }
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: MetricCardProps) {
  return (
    <div className="group relative rounded-xl border border-border/50 bg-card p-5 md:p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</p>
          <div className="mt-3 md:mt-4">
            <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground mt-2">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className="mt-3 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  trend.direction === 'up' 
                    ? 'text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-950' 
                    : 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-950'
                }`}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">from last month</span>
            </div>
          )}
        </div>
        <div className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 group-hover:from-primary/25 group-hover:to-primary/10 transition-colors duration-300 flex-shrink-0">
          <Icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
        </div>
      </div>
    </div>
  )
}
