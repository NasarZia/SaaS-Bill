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

const UNITS = ['pc', 'kg', 'liter', 'meter', 'box', 'dozen', 'hour', 'service']

interface Product {
  id: number
  name: string
  hsn_code: string | null
  unit: string
  price: number
  gst_rate: number
  sku: string | null
  quantity_in_stock?: number
  is_active?: boolean
}

const emptyForm = {
  name: '',
  description: '',
  hsn_code: '',
  unit: 'pc',
  price: '',
  gst_rate: '',
  sku: '',
  quantity_in_stock: '0',
  notes: '',
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const res = await api.get('/products?limit=100')
      const data = res.data?.items ?? res.data
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hsn_code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setDialogOpen(true)
  }

  const openEdit = (p: Product) => {
    setEditingId(p.id)
    setForm({
      name: p.name,
      description: '',
      hsn_code: p.hsn_code ?? '',
      unit: p.unit ?? 'pc',
      price: String(p.price ?? ''),
      gst_rate: String(p.gst_rate ?? ''),
      sku: p.sku ?? '',
      quantity_in_stock: String(p.quantity_in_stock ?? 0),
      notes: '',
    })
    setError('')
    setDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Product name is required')
      return
    }
    const price = parseFloat(form.price)
    if (isNaN(price) || price < 0) {
      setError('Valid price is required')
      return
    }
    setSubmitLoading(true)
    setError('')
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        hsn_code: form.hsn_code.trim() || undefined,
        unit: form.unit,
        price,
        gst_rate: form.gst_rate ? parseFloat(form.gst_rate) : undefined,
        sku: form.sku.trim() || undefined,
        quantity_in_stock: parseInt(form.quantity_in_stock, 10) || 0,
        notes: form.notes.trim() || undefined,
      }
      if (editingId) {
        await api.put(`/products/${editingId}`, payload)
      } else {
        await api.post('/products', payload)
      }
      setDialogOpen(false)
      fetchProducts()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response?.data?.error?.message ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save product'
      setError(msg)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product? It cannot be used in new invoices.')) return
    try {
      await api.delete(`/products/${id}`)
      setDeleteId(null)
      fetchProducts()
    } catch {
      setDeleteId(null)
    }
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Products</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your product list</p>
        </div>
        <Button className="w-full md:w-auto h-10 md:h-9" onClick={openNew}>
          <Plus className="h-4 w-4 mr-2" />
          New Product
        </Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'New Product'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Product name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <select
                  id="unit"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                >
                  {UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst_rate">GST %</Label>
                <Input
                  id="gst_rate"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={form.gst_rate}
                  onChange={(e) => setForm((f) => ({ ...f, gst_rate: e.target.value }))}
                  placeholder="18"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hsn_code">HSN Code</Label>
              <Input
                id="hsn_code"
                value={form.hsn_code}
                onChange={(e) => setForm((f) => ({ ...f, hsn_code: e.target.value }))}
                placeholder="e.g. 84713050"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                value={form.sku}
                onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                placeholder="Stock keeping unit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity_in_stock">Quantity in stock</Label>
              <Input
                id="quantity_in_stock"
                type="number"
                min={0}
                value={form.quantity_in_stock}
                onChange={(e) => setForm((f) => ({ ...f, quantity_in_stock: e.target.value }))}
              />
            </div>
            <DialogFooter showCloseButton>
              <Button type="submit" disabled={submitLoading}>
                {submitLoading ? 'Saving...' : editingId ? 'Update' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-10 h-10 md:h-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading products...</p>
        </Card>
      ) : filteredProducts.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">
            {products.length === 0 ? 'No products yet. Click New Product to add one.' : 'No products found. Try a different search.'}
          </p>
        </Card>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">HSN Code</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">GST Rate</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Unit Price</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Unit</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{product.hsn_code ?? '—'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {Number(product.gst_rate)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">₹{Number(product.price).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">{product.unit}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon-sm" onClick={() => openEdit(product)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(product.id)}>
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
            {filteredProducts.map((product) => (
              <Card key={product.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">HSN: {product.hsn_code ?? '—'}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEdit(product)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => setDeleteId(product.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium">₹{Number(product.price).toLocaleString('en-IN')} / {product.unit}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">GST Rate:</span>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                        {Number(product.gst_rate)}%
                      </span>
                    </div>
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
              <DialogTitle>Delete product?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">This cannot be undone. Products already used in invoices cannot be deleted.</p>
            <DialogFooter showCloseButton>
              <Button variant="destructive" onClick={() => handleDelete(deleteId)}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
