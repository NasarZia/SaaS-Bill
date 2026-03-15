'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import api from '@/lib/api'

interface Customer {
  id: number
  name: string
  email: string | null
  phone: string | null
  city: string | null
  state: string | null
  gstin: string | null
  is_active?: boolean
  created_at?: string
}

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  gstin: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  contact_person: '',
  notes: '',
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const res = await api.get('/customers?limit=100')
      const data = res.data?.items ?? res.data
      setCustomers(Array.isArray(data) ? data : [])
    } catch (e) {
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
  )

  const handleOpenNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setDialogOpen(true)
  }

  const handleOpenEdit = async (c: Customer) => {
    setError('')
    setEditingId(c.id)
    try {
      const res = await api.get(`/customers/${c.id}`)
      const d = res.data
      setForm({
        name: d.name ?? '',
        email: d.email ?? '',
        phone: d.phone ?? '',
        gstin: d.gstin ?? '',
        address_line1: d.address_line1 ?? '',
        address_line2: d.address_line2 ?? '',
        city: d.city ?? '',
        state: d.state ?? '',
        postal_code: d.postal_code ?? '',
        contact_person: d.contact_person ?? '',
        notes: d.notes ?? '',
      })
      setDialogOpen(true)
    } catch {
      setEditingId(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Customer name is required')
      return
    }
    setSubmitLoading(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        gstin: form.gstin.trim() || undefined,
        address_line1: form.address_line1.trim() || undefined,
        address_line2: form.address_line2.trim() || undefined,
        city: form.city.trim() || undefined,
        state: form.state.trim() || undefined,
        postal_code: form.postal_code.trim() || undefined,
        contact_person: form.contact_person.trim() || undefined,
        notes: form.notes.trim() || undefined,
      }
      if (editingId) {
        await api.put(`/customers/${editingId}`, payload)
      } else {
        await api.post('/customers', payload)
      }
      setDialogOpen(false)
      setEditingId(null)
      fetchCustomers()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })
          ?.response?.data?.error?.message ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (editingId ? 'Failed to update customer' : 'Failed to create customer')
      setError(msg)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/customers/${id}`)
      setDeleteId(null)
      fetchCustomers()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ||
        'Could not delete. Customer may have invoices — deactivate instead.'
      alert(msg)
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your customer list</p>
        </div>
        <Button className="w-full md:w-auto h-10 md:h-9" onClick={handleOpenNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>

      {/* New Customer Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Customer' : 'New Customer'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Customer or company name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                placeholder="+91-9876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input
                id="gstin"
                value={form.gstin}
                onChange={(e) => setForm((f) => ({ ...f, gstin: e.target.value }))}
                placeholder="15-character GSTIN"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_line1">Address</Label>
              <Input
                id="address_line1"
                value={form.address_line1}
                onChange={(e) => setForm((f) => ({ ...f, address_line1: e.target.value }))}
                placeholder="Address line 1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                  placeholder="State"
                />
              </div>
            </div>
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? (editingId ? 'Updating...' : 'Creating...') : (editingId ? 'Update Customer' : 'Create Customer')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search customers..."
          className="pl-10 h-10 md:h-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading customers...</p>
        </Card>
      ) : filteredCustomers.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {customers.length === 0
              ? 'No customers yet. Click New Customer to add one.'
              : 'No customers found. Try a different search.'}
          </p>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Phone</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">City</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{customer.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{customer.email ?? '—'}</td>
                    <td className="px-4 py-3">{customer.phone ?? '—'}</td>
                    <td className="px-4 py-3">{customer.city ?? '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(customer)} title="Edit">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(customer.id)} title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email ?? '—'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => handleOpenEdit(customer)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(customer.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{customer.phone ?? '—'}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">City:</span>
                      <span className="font-medium">{customer.city ?? '—'}</span>
                    </div>
                    {customer.gstin && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">GSTIN:</span>
                        <span className="font-medium text-xs">{customer.gstin}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {deleteId != null && (
        <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete customer?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">This cannot be undone. Customers with existing invoices cannot be deleted.</p>
            <DialogFooter showCloseButton>
              <Button variant="destructive" onClick={() => handleDelete(deleteId)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
