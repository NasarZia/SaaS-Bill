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
    <div className="rounded-lg border bg-card p-4 md:p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs md:text-sm font-medium text-muted-foreground">{title}</p>
          <div className="mt-2 md:mt-3">
            <p className="text-2xl md:text-3xl font-bold text-card-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={`text-xs font-medium ${
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-muted-foreground">from last month</span>
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 md:h-7 md:w-7 text-primary" />
        </div>
      </div>
    </div>
  )
}
