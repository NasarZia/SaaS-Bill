'use client'

import { MetricCard } from '@/components/metric-card'
import { IndianRupee, FileText, Users, TrendingUp } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function DashboardHome() {
  // Mock data - will be fetched from API in production
  const metrics = {
    totalSales: '₹2,45,680',
    totalSalesChange: 12,
    outstandingAmount: '₹45,200',
    outstandingChange: -5,
    totalInvoices: 28,
    invoicesChange: 8,
    totalCustomers: 12,
    customersChange: 3,
  }

  const recentInvoices = [
    {
      id: 'INV-001',
      customer: 'ABC Industries',
      amount: '₹25,000',
      date: '2026-03-10',
      status: 'Paid',
    },
    {
      id: 'INV-002',
      customer: 'XYZ Trading',
      amount: '₹18,500',
      date: '2026-03-09',
      status: 'Pending',
    },
    {
      id: 'INV-003',
      customer: 'Tech Solutions',
      amount: '₹12,300',
      date: '2026-03-08',
      status: 'Overdue',
    },
  ]

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground">Welcome back! Here's your business overview.</p>
      </div>

      {/* Metric Cards - Stacked on mobile, Grid on desktop */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Sales"
          value={metrics.totalSales}
          icon={IndianRupee}
          trend={{ value: metrics.totalSalesChange, direction: 'up' }}
          subtitle="This month"
        />
        <MetricCard
          title="Outstanding"
          value={metrics.outstandingAmount}
          icon={TrendingUp}
          trend={{ value: metrics.outstandingChange, direction: 'down' }}
          subtitle="Amount due"
        />
        <MetricCard
          title="Total Invoices"
          value={metrics.totalInvoices}
          icon={FileText}
          trend={{ value: metrics.invoicesChange, direction: 'up' }}
          subtitle="This month"
        />
        <MetricCard
          title="Customers"
          value={metrics.totalCustomers}
          icon={Users}
          trend={{ value: metrics.customersChange, direction: 'up' }}
          subtitle="Active"
        />
      </div>

      {/* Recent Invoices Section */}
      <Card>
        <div className="border-b px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-lg md:text-xl font-semibold">Recent Invoices</h2>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b hover:bg-muted/20">
                  <td className="px-4 py-3 font-medium">{invoice.id}</td>
                  <td className="px-4 py-3">{invoice.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{invoice.date}</td>
                  <td className="px-4 py-3 font-medium">{invoice.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        invoice.status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y">
          {recentInvoices.map((invoice) => (
            <div key={invoice.id} className="px-4 py-4 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    invoice.status === 'Paid'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{invoice.date}</p>
                <p className="font-medium">{invoice.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
