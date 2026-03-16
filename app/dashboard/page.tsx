'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MetricCard } from '@/components/metric-card'
import { IndianRupee, FileText, Users, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import api from '@/lib/api'

interface InvoiceItem {
  id: number
  invoice_number: string
  customer: { id: number; name: string } | null
  invoice_date: string
  total_amount: number
  status: string
  is_paid: boolean
}

export default function DashboardHome() {
  const [invoices, setInvoices] = useState<InvoiceItem[]>([])
  const [summary, setSummary] = useState({ total_paid: 0, total_sent: 0, total_draft: 0, total_overdue: 0 })
  const [customerCount, setCustomerCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [invRes, custRes] = await Promise.all([
          api.get('/invoices?limit=10&sort=invoice_date&order=desc'),
          api.get('/customers?limit=1'),
        ])
        const invData = invRes.data
        const items = invData?.items ?? []
        setInvoices(Array.isArray(items) ? items : [])
        setSummary({
          total_paid: invData?.summary?.total_paid ?? 0,
          total_sent: invData?.summary?.total_sent ?? 0,
          total_draft: invData?.summary?.total_draft ?? 0,
          total_overdue: invData?.summary?.total_overdue ?? 0,
        })
        const custData = custRes.data
        const pagination = custData?.pagination
        setCustomerCount(Number(pagination?.total) || 0)
      } catch {
        setInvoices([])
        setCustomerCount(0)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const totalPaidAmount = invoices.filter((i) => i.is_paid).reduce((s, i) => s + Number(i.total_amount), 0)
  const totalOutstanding = invoices.filter((i) => !i.is_paid && i.status !== 'draft').reduce((s, i) => s + Number(i.total_amount), 0)
  const invoiceCount = summary.total_paid + summary.total_sent + summary.total_draft

  const formatRupee = (n: number) => '₹' + (n >= 1e5 ? (n / 1e5).toFixed(1) + 'L' : n.toLocaleString('en-IN'))

  const getStatusLabel = (status: string, isPaid: boolean) => {
    if (isPaid) return 'Paid'
    if (status === 'sent' || status === 'viewed') return 'Pending'
    if (status === 'overdue') return 'Overdue'
    if (status === 'draft') return 'Draft'
    return status
  }

  const getStatusClass = (status: string, isPaid: boolean) => {
    if (isPaid) return 'bg-green-100 text-green-800'
    if (status === 'overdue') return 'bg-red-100 text-red-800'
    if (status === 'draft') return 'bg-gray-100 text-gray-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  return (
    <div className="space-y-7 p-4 md:p-8 bg-gradient-to-b from-background to-background/50">
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Dashboard</h1>
        <p className="text-base md:text-lg text-muted-foreground">Welcome back! Here&apos;s your business overview.</p>
      </div>

      {loading ? (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-5 md:p-7 h-32 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Sales"
            value={formatRupee(totalPaidAmount)}
            icon={IndianRupee}
            subtitle="Paid invoices"
          />
          <MetricCard
            title="Outstanding"
            value={formatRupee(totalOutstanding)}
            icon={TrendingUp}
            subtitle="Amount due"
          />
          <MetricCard
            title="Total Invoices"
            value={invoiceCount}
            icon={FileText}
            subtitle="All time"
          />
          <MetricCard
            title="Customers"
            value={customerCount}
            icon={Users}
            subtitle="Active"
          />
        </div>
      )}

      <Card className="rounded-xl border-border/50 shadow-sm">
        <div className="border-b border-border/50 px-5 py-4 md:px-7 md:py-5 flex items-center justify-between bg-gradient-to-r from-card to-transparent">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Recent Invoices</h2>
          <Link href="/dashboard/invoices">
            <span className="text-sm font-semibold text-primary hover:text-primary/90 transition-colors duration-200">View all</span>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted-foreground">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">No invoices yet. Create one from Invoices.</div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border/50 bg-muted/30">
                  <tr>
                    <th className="px-5 py-4 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Invoice</th>
                    <th className="px-5 py-4 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Customer</th>
                    <th className="px-5 py-4 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Date</th>
                    <th className="px-5 py-4 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Amount</th>
                    <th className="px-5 py-4 text-left font-semibold text-muted-foreground uppercase text-xs tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/20 transition-colors duration-200">
                      <td className="px-5 py-4 font-semibold text-foreground">{inv.invoice_number}</td>
                      <td className="px-5 py-4 text-foreground">{inv.customer?.name ?? '—'}</td>
                      <td className="px-5 py-4 text-muted-foreground">
                        {typeof inv.invoice_date === 'string' ? inv.invoice_date.slice(0, 10) : inv.invoice_date}
                      </td>
                      <td className="px-5 py-4 font-semibold text-foreground">{formatRupee(Number(inv.total_amount))}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(inv.status, inv.is_paid)}`}>
                          {getStatusLabel(inv.status, inv.is_paid)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-border/30">
              {invoices.map((inv) => (
                <Link key={inv.id} href="/dashboard/invoices">
                  <div className="px-5 py-5 space-y-3 hover:bg-muted/20 transition-colors duration-200">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{inv.invoice_number}</p>
                        <p className="text-sm text-muted-foreground">{inv.customer?.name ?? '—'}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold flex-shrink-0 ${getStatusClass(inv.status, inv.is_paid)}`}>
                        {getStatusLabel(inv.status, inv.is_paid)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {typeof inv.invoice_date === 'string' ? inv.invoice_date.slice(0, 10) : inv.invoice_date}
                      </p>
                      <p className="font-semibold text-foreground">{formatRupee(Number(inv.total_amount))}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
