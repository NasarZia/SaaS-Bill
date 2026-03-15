'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Download, Eye, Trash2, Search, Filter } from 'lucide-react'
import api from '@/lib/api'
import { amountToWords } from '@/lib/utils'

type StatusFilter = 'all' | 'paid' | 'sent' | 'draft' | 'overdue'

interface Invoice {
  id: number
  invoice_number: string
  customer: { id: number; name: string; email?: string; phone?: string; gstin?: string; address?: string; city?: string; state?: string; postal_code?: string } | null
  invoice_date: string
  due_date: string | null
  status: string
  total_amount: number
  is_paid: boolean
  is_sent: boolean
  items?: Array<{ product_id: number; product_name: string; quantity: number; unit_price: number; gst_rate: number }>
  shipping_address?: string
  shipping_city?: string
  shipping_state?: string
  shipping_postal_code?: string
  shipping_country?: string
  authorized_signatory?: string
}

interface Customer {
  id: number
  name: string
  email: string | null
  phone?: string
  gstin?: string
  address?: string
  city?: string
  state?: string
  postal_code?: string
}

interface Product {
  id: number
  name: string
  price: number
  gst_rate: number
  unit: string
  hsn_code?: string
}

interface CompanySettings {
  company_name: string
  logo_url?: string
  gstin: string
  pan: string
  phone: string
  email: string
  website: string
  address_line1: string
  address_line2: string
  city: string
  state: string
  postal_code: string
  country: string
  bank_name: string
  bank_account_number: string
  ifsc_code: string
  upi_id?: string
  qr_code_url?: string
  authorized_signatory?: string
  enable_signature_on_invoice: boolean
  enable_shipping_on_invoice: boolean
  shipping_address?: string
  shipping_city?: string
  shipping_state?: string
  shipping_postal_code?: string
  shipping_country?: string
  terms_and_conditions: string
}

interface CreateInvoiceForm {
  customer_id: string
  items: { product_id: number; quantity: number; unit_price?: number }[]
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  shipping_country: string
  authorized_signatory: string
  include_shipping: boolean
  include_signature: boolean
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [viewId, setViewId] = useState<number | null>(null)
  const [viewData, setViewData] = useState<Invoice | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [createForm, setCreateForm] = useState<CreateInvoiceForm>({
    customer_id: '',
    items: [],
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'India',
    authorized_signatory: '',
    include_shipping: false,
    include_signature: false,
  })
  const [createSubmitting, setCreateSubmitting] = useState(false)
  const [createError, setCreateError] = useState('')

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const statusParam = statusFilter === 'all' ? '' : `&status=${statusFilter}`
      const res = await api.get(`/invoices?limit=50${statusParam}&sort=invoice_date&order=desc`)
      const data = res.data?.items ?? res.data
      setInvoices(Array.isArray(data) ? data : [])
    } catch {
      setInvoices([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [statusFilter])

  useEffect(() => {
    if (viewId == null) {
      setViewData(null)
      return
    }
    Promise.all([
      api.get(`/invoices/${viewId}`),
      api.get('/settings')
    ]).then(([invoiceRes, settingsRes]) => {
      setViewData(invoiceRes.data)
      setSettings(settingsRes.data)
    }).catch(() => {
      setViewData(null)
    })
  }, [viewId])

  useEffect(() => {
    if (!createOpen) return
    api.get('/customers?limit=200').then((r) => {
      const items = r.data?.items ?? r.data
      setCustomers(Array.isArray(items) ? items : [])
    })
    api.get('/products?limit=200').then((r) => {
      const items = r.data?.items ?? r.data
      setProducts(Array.isArray(items) ? items : [])
    })
    api.get('/settings').then((r) => {
      setSettings(r.data)
      setCreateForm((prev) => ({
        ...prev,
        include_shipping: r.data?.enable_shipping_on_invoice ?? false,
        include_signature: r.data?.enable_signature_on_invoice ?? false,
        shipping_address: r.data?.shipping_address ?? '',
        shipping_city: r.data?.shipping_city ?? '',
        shipping_state: r.data?.shipping_state ?? '',
        shipping_postal_code: r.data?.shipping_postal_code ?? '',
        shipping_country: r.data?.shipping_country ?? 'India',
        authorized_signatory: r.data?.authorized_signatory ?? '',
      }))
    })
  }, [createOpen])

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase()
    return (
      inv.invoice_number?.toLowerCase().includes(q) ||
      inv.customer?.name?.toLowerCase().includes(q)
    )
  })

  const getStatusLabel = (status: string, isPaid: boolean) => {
    if (isPaid) return 'Paid'
    if (status === 'sent' || status === 'viewed') return 'Pending'
    if (status === 'overdue') return 'Overdue'
    if (status === 'draft') return 'Draft'
    return status
  }

  const getStatusColor = (status: string, isPaid: boolean) => {
    if (isPaid) return 'bg-green-100 text-green-800'
    if (status === 'overdue') return 'bg-red-100 text-red-800'
    if (status === 'draft') return 'bg-gray-100 text-gray-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const downloadPdf = async (id: number, invoiceNumber: string) => {
    try {
      const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' })
      const url = URL.createObjectURL(res.data as Blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${invoiceNumber}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }

  const addCreateItem = () => {
    const first = products[0]
    if (first) {
      setCreateForm((prev) => ({
        ...prev,
        items: [...prev.items, { product_id: first.id, quantity: 1, unit_price: first.price }],
      }))
    }
  }

  const updateCreateItem = (index: number, field: 'product_id' | 'quantity' | 'unit_price', value: number) => {
    setCreateForm((prev) => {
      const items = [...prev.items]
      if (!items[index]) return prev
      items[index] = { ...items[index], [field]: value }
      return { ...prev, items }
    })
  }

  const removeCreateItem = (index: number) => {
    setCreateForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const customerId = parseInt(createForm.customer_id, 10)
    if (!customerId || createForm.items.length === 0) {
      setCreateError('Select a customer and add at least one item.')
      return
    }
    setCreateSubmitting(true)
    setCreateError('')
    try {
      const today = new Date().toISOString().slice(0, 10)
      const due = new Date()
      due.setDate(due.getDate() + 30)
      await api.post('/invoices', {
        customer_id: customerId,
        invoice_date: today,
        due_date: due.toISOString().slice(0, 10),
        status: 'draft',
        items: createForm.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          unit_price: products.find((p) => p.id === i.product_id)?.price ?? i.unit_price,
          gst_rate: products.find((p) => p.id === i.product_id)?.gst_rate,
        })),
        shipping_address: createForm.include_shipping ? createForm.shipping_address : undefined,
        shipping_city: createForm.include_shipping ? createForm.shipping_city : undefined,
        shipping_state: createForm.include_shipping ? createForm.shipping_state : undefined,
        shipping_postal_code: createForm.include_shipping ? createForm.shipping_postal_code : undefined,
        shipping_country: createForm.include_shipping ? createForm.shipping_country : undefined,
        authorized_signatory: createForm.include_signature ? createForm.authorized_signatory : undefined,
      })
      setCreateOpen(false)
      setCreateForm({
        customer_id: '',
        items: [],
        shipping_address: '',
        shipping_city: '',
        shipping_state: '',
        shipping_postal_code: '',
        shipping_country: 'India',
        authorized_signatory: '',
        include_shipping: false,
        include_signature: false,
      })
      fetchInvoices()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response?.data?.error?.message ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to create invoice'
      setCreateError(msg)
    } finally {
      setCreateSubmitting(false)
    }
  }

  const deleteInvoice = async (id: number, status: string) => {
    if (status !== 'draft') {
      alert('Only draft invoices can be deleted.')
      return
    }
    if (!confirm('Delete this draft invoice?')) return
    try {
      await api.delete(`/invoices/${id}`)
      fetchInvoices()
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Invoices</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your invoices</p>
        </div>
        <Button className="w-full md:w-auto h-10 md:h-9" onClick={() => { 
          setCreateOpen(true)
          setCreateForm({
            customer_id: '',
            items: [],
            shipping_address: settings?.shipping_address ?? '',
            shipping_city: settings?.shipping_city ?? '',
            shipping_state: settings?.shipping_state ?? '',
            shipping_postal_code: settings?.shipping_postal_code ?? '',
            shipping_country: settings?.shipping_country ?? 'India',
            authorized_signatory: settings?.authorized_signatory ?? '',
            include_shipping: settings?.enable_shipping_on_invoice ?? false,
            include_signature: settings?.enable_signature_on_invoice ?? false,
          })
          setCreateError('')
        }}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-10 h-10 md:h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto md:gap-2">
          {(['all', 'draft', 'sent', 'paid', 'overdue'] as const).map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'default' : 'outline'}
              size="sm"
              className="whitespace-nowrap h-10 md:h-9"
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' && <Filter className="h-4 w-4 mr-1" />}
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading invoices...</p>
        </Card>
      ) : filteredInvoices.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {invoices.length === 0 ? 'No invoices yet. Click New Invoice to create one.' : 'No invoices found.'}
          </p>
        </Card>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Invoice</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{inv.invoice_number}</td>
                    <td className="px-4 py-3">{inv.customer?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {typeof inv.invoice_date === 'string' ? inv.invoice_date.slice(0, 10) : inv.invoice_date}
                    </td>
                    <td className="px-4 py-3 font-medium">₹{Number(inv.total_amount).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(inv.status, inv.is_paid)}`}>
                        {getStatusLabel(inv.status, inv.is_paid)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => setViewId(inv.id)} title="View">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => downloadPdf(inv.id, inv.invoice_number)} title="Download PDF">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => deleteInvoice(inv.id, inv.status)} title="Delete (draft only)">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {filteredInvoices.map((inv) => (
              <Card key={inv.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{inv.invoice_number}</p>
                      <p className="text-sm text-muted-foreground">{inv.customer?.name ?? '—'}</p>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(inv.status, inv.is_paid)}`}>
                      {getStatusLabel(inv.status, inv.is_paid)}
                    </span>
                  </div>
                  <div className="space-y-1 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{typeof inv.invoice_date === 'string' ? inv.invoice_date.slice(0, 10) : inv.invoice_date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">₹{Number(inv.total_amount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => setViewId(inv.id)}>
                      <Eye className="h-3 w-3 mr-1" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-8" onClick={() => downloadPdf(inv.id, inv.invoice_number)}>
                      <Download className="h-3 w-3 mr-1" /> PDF
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* View invoice dialog - Professional Invoice Preview */}
      <Dialog open={viewId != null} onOpenChange={(open) => !open && setViewId(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Invoice {viewData?.invoice_number}</DialogTitle>
          </DialogHeader>
          {viewData && (
            <div className="p-4 md:p-8 bg-white space-y-6">
              {/* Header Section with Logo */}
              <div className="flex justify-between items-start pb-6 border-b">
                <div className="flex-1">
                  {viewData.company?.logo_url && (
                    <div className="mb-3">
                      <img 
                        src={viewData.company.logo_url} 
                        alt="Company Logo" 
                        className="h-20 w-auto object-contain" 
                        onError={(e) => { e.currentTarget.parentElement!.style.display = 'none' }} 
                      />
                    </div>
                  )}
                  <div className="text-sm">
                    <p className="font-bold text-lg">{viewData.company?.name || settings?.company_name}</p>
                    <p className="text-gray-600 text-xs">{settings?.address_line1}</p>
                    {settings?.address_line2 && <p className="text-gray-600 text-xs">{settings.address_line2}</p>}
                    <p className="text-gray-600 text-xs">{settings?.city}, {settings?.state} - {settings?.postal_code}</p>
                    {settings?.email && <p className="text-gray-600 text-xs">{settings.email}</p>}
                    {settings?.phone && <p className="text-gray-600 text-xs">Phone: {settings.phone}</p>}
                    {viewData.company?.gstin && <p className="text-gray-600 font-mono text-xs">GSTIN: {viewData.company.gstin}</p>}
                    {settings?.pan && <p className="text-gray-600 font-mono text-xs">PAN: {settings.pan}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600 mb-2">TAX INVOICE</p>
                  <div className="text-xs space-y-1 text-gray-600">
                    <div><span className="font-semibold">Invoice No:</span> {viewData.invoice_number}</div>
                    <div><span className="font-semibold">Issue Date:</span> {viewData.invoice_date?.slice(0, 10)}</div>
                    <div><span className="font-semibold">Due Date:</span> {viewData.due_date?.slice(0, 10)}</div>
                  </div>
                </div>
              </div>

              {/* Billing & Shipping Info */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b text-sm">
                <div>
                  <p className="font-bold text-gray-700 mb-2">BILLED TO</p>
                  <p className="font-semibold">{viewData.customer?.name}</p>
                  {viewData.customer?.address && <p className="text-gray-600">{viewData.customer.address}</p>}
                  {viewData.customer?.gstin && <p className="text-gray-600 font-mono">GSTIN: {viewData.customer.gstin}</p>}
                </div>
                {(viewData.shipping?.address || viewData.company?.enable_shipping_on_invoice) && (
                  <div>
                    <p className="font-bold text-gray-700 mb-2">SHIPPED TO</p>
                    <p className="font-semibold">{viewData.customer?.name}</p>
                    {viewData.shipping?.address && <p className="text-gray-600">{viewData.shipping.address}</p>}
                    {viewData.shipping?.city && <p className="text-gray-600">{viewData.shipping.city}, {viewData.shipping.state} - {viewData.shipping.postal_code}</p>}
                  </div>
                )}
              </div>

              {/* Items Table */}
              {viewData.items && viewData.items.length > 0 && (
                <div className="pb-6 overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Sr. No</th>
                        <th className="border p-2 text-left">Item Description</th>
                        <th className="border p-2 text-left">HSN/SAC</th>
                        <th className="border p-2 text-right">Qty</th>
                        <th className="border p-2 text-right">Unit Price</th>
                        <th className="border p-2 text-right">Taxable Value</th>
                        <th className="border p-2 text-right">GST %</th>
                        <th className="border p-2 text-right">GST Amt</th>
                        <th className="border p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewData.items.map((item: any, idx: number) => {
                        const taxableValue = item.line_total || (item.quantity * item.unit_price)
                        const gstAmount = item.igst_amount || item.cgst_amount || item.sgst_amount || 0
                        const total = item.item_total_with_tax || (taxableValue + gstAmount)
                        return (
                          <tr key={idx} className="border">
                            <td className="border p-2 text-left">{idx + 1}</td>
                            <td className="border p-2 text-left">{item.product?.name || 'Product'}</td>
                            <td className="border p-2 text-left">{item.product?.hsn_code || '—'}</td>
                            <td className="border p-2 text-right">{item.quantity}</td>
                            <td className="border p-2 text-right">₹{item.unit_price.toLocaleString('en-IN')}</td>
                            <td className="border p-2 text-right">₹{taxableValue.toLocaleString('en-IN')}</td>
                            <td className="border p-2 text-right">{item.gst_rate}%</td>
                            <td className="border p-2 text-right">₹{gstAmount.toLocaleString('en-IN')}</td>
                            <td className="border p-2 text-right font-semibold">₹{total.toLocaleString('en-IN')}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals & Amount in Words */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b">
                <div className="text-sm">
                  {viewData.company?.bank_name && (
                    <div className="mb-4">
                      <p className="font-bold text-gray-700 mb-2">BANK DETAILS</p>
                      <p className="text-gray-600">Bank: {viewData.company.bank_name}</p>
                      <p className="text-gray-600">Account No: {viewData.company.bank_account_number}</p>
                      <p className="text-gray-600">IFSC: {viewData.company.ifsc_code}</p>
                    </div>
                  )}
                  {(viewData.company?.upi_id || viewData.company?.qr_code_url) && (
                    <div>
                      <p className="font-bold text-gray-700 mb-2">UPI PAYMENT</p>
                      {viewData.company?.upi_id && <p className="text-gray-600 text-sm">{viewData.company.upi_id}</p>}
                      {viewData.company?.qr_code_url && (
                        <div className="mt-2">
                          <img 
                            src={viewData.company.qr_code_url} 
                            alt="QR Code" 
                            className="h-24 w-24 border border-gray-300" 
                            onError={(e) => { e.currentTarget.src = ''; e.currentTarget.style.display = 'none' }} 
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right text-sm">
                  <div className="space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span>Total Taxable Value:</span>
                      <span>₹{(viewData.subtotal || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>GST:</span>
                      <span>₹{(viewData.total_tax_amount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t pt-1">
                      <span>Grand Total:</span>
                      <span>₹{(viewData.total_amount || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 italic">
                    <p>{amountToWords(viewData.total_amount || 0)}</p>
                  </div>
                </div>
              </div>

              {/* Terms & Conditions */}
              {viewData.company?.terms_and_conditions && (
                <div className="pb-6 border-b text-xs">
                  <p className="font-bold text-gray-700 mb-2">TERMS & CONDITIONS</p>
                  <div className="text-gray-600 whitespace-pre-wrap">{viewData.company.terms_and_conditions}</div>
                </div>
              )}

              {/* Notes */}
              <div className="pb-6 text-xs">
                <p className="text-gray-600 italic">This is a computer-generated invoice. No physical signature required.</p>
              </div>

              {/* Signature */}
              {(viewData.authorized_signatory || viewData.company?.enable_signature_on_invoice) && (
                <div className="flex justify-end">
                  <div className="text-center">
                    <div className="h-8 mb-1"></div>
                    <p className="text-xs font-semibold text-gray-700 border-t pt-1">
                      {viewData.authorized_signatory || viewData.company?.authorized_signatory || 'Authorized Signatory'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New invoice dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Invoice</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitCreate} className="space-y-4">
            {createError && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{createError}</p>}
            
            <div className="space-y-2">
              <Label>Customer *</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={createForm.customer_id}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, customer_id: e.target.value }))}
                required
              >
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label>Items *</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCreateItem}>Add line</Button>
              </div>
              {createForm.items.map((item, idx) => {
                const prod = products.find((p) => p.id === item.product_id)
                return (
                  <div key={idx} className="flex gap-2 items-center py-1">
                    <select
                      className="flex h-9 flex-1 rounded-md border border-input bg-background px-2 text-sm"
                      value={item.product_id}
                      onChange={(e) => updateCreateItem(idx, 'product_id', parseInt(e.target.value, 10))}
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} — ₹{Number(p.price).toLocaleString('en-IN')}</option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min={1}
                      step={0.01}
                      className="w-20 h-9"
                      value={item.quantity}
                      onChange={(e) => updateCreateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    />
                    <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeCreateItem(idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
              {createForm.items.length === 0 && (
                <Button type="button" variant="outline" size="sm" onClick={addCreateItem}>Add first item</Button>
              )}
            </div>

            {settings?.enable_shipping_on_invoice && (
              <>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <input
                    id="include_shipping"
                    type="checkbox"
                    checked={createForm.include_shipping}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, include_shipping: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <Label htmlFor="include_shipping" className="text-sm font-medium cursor-pointer">Include shipping details</Label>
                </div>
                {createForm.include_shipping && (
                  <div className="space-y-2 bg-gray-50 p-3 rounded">
                    <Input
                      placeholder="Shipping address"
                      value={createForm.shipping_address}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, shipping_address: e.target.value }))}
                      className="h-9 text-sm"
                    />
                    <Input
                      placeholder="City"
                      value={createForm.shipping_city}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, shipping_city: e.target.value }))}
                      className="h-9 text-sm"
                    />
                    <Input
                      placeholder="State"
                      value={createForm.shipping_state}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, shipping_state: e.target.value }))}
                      className="h-9 text-sm"
                    />
                    <Input
                      placeholder="Postal code"
                      value={createForm.shipping_postal_code}
                      onChange={(e) => setCreateForm((prev) => ({ ...prev, shipping_postal_code: e.target.value }))}
                      className="h-9 text-sm"
                    />
                  </div>
                )}
              </>
            )}

            {settings?.enable_signature_on_invoice && (
              <>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <input
                    id="include_signature"
                    type="checkbox"
                    checked={createForm.include_signature}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, include_signature: e.target.checked }))}
                    className="w-4 h-4 rounded"
                  />
                  <Label htmlFor="include_signature" className="text-sm font-medium cursor-pointer">Include signature</Label>
                </div>
                {createForm.include_signature && (
                  <Input
                    placeholder="Authorized signatory name"
                    value={createForm.authorized_signatory}
                    onChange={(e) => setCreateForm((prev) => ({ ...prev, authorized_signatory: e.target.value }))}
                    className="h-9 text-sm"
                  />
                )}
              </>
            )}

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={createSubmitting || createForm.items.length === 0}>
                {createSubmitting ? 'Creating...' : 'Create Invoice'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
