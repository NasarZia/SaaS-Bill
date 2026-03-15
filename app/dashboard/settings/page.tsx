'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Save } from 'lucide-react'
import api from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

interface CompanySettings {
  company_name: string
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
  bank_account_number: string
  bank_name: string
  ifsc_code: string
  terms_and_conditions: string
  invoice_prefix: string
  invoice_next_number: number
  logo_url: string
  upi_id: string
  qr_code_url: string
  authorized_signatory: string
  enable_signature_on_invoice: boolean
  enable_shipping_on_invoice: boolean
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_postal_code: string
  shipping_country: string
}

const emptySettings: CompanySettings = {
  company_name: '',
  gstin: '',
  pan: '',
  phone: '',
  email: '',
  website: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  postal_code: '',
  country: 'India',
  bank_account_number: '',
  bank_name: '',
  ifsc_code: '',
  terms_and_conditions: '',
  invoice_prefix: 'INV',
  invoice_next_number: 1001,
  logo_url: '',
  upi_id: '',
  qr_code_url: '',
  authorized_signatory: '',
  enable_signature_on_invoice: false,
  enable_shipping_on_invoice: false,
  shipping_address: '',
  shipping_city: '',
  shipping_state: '',
  shipping_postal_code: '',
  shipping_country: 'India',
}

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const [formData, setFormData] = useState<CompanySettings>(emptySettings)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    api.get('/settings')
      .then((res) => {
        const d = res.data
        if (d) {
          setFormData({
            company_name: d.company_name ?? '',
            gstin: d.gstin ?? '',
            pan: d.pan ?? '',
            phone: d.phone ?? '',
            email: d.email ?? '',
            website: d.website ?? '',
            address_line1: d.address_line1 ?? '',
            address_line2: d.address_line2 ?? '',
            city: d.city ?? '',
            state: d.state ?? '',
            postal_code: d.postal_code ?? '',
            country: d.country ?? 'India',
            bank_account_number: d.bank_account_number ?? '',
            bank_name: d.bank_name ?? '',
            ifsc_code: d.ifsc_code ?? '',
            terms_and_conditions: d.terms_and_conditions ?? '',
            invoice_prefix: d.invoice_prefix ?? 'INV',
            invoice_next_number: d.invoice_next_number ?? 1001,
            logo_url: d.logo_url ?? '',
            upi_id: d.upi_id ?? '',
            qr_code_url: d.qr_code_url ?? '',
            authorized_signatory: d.authorized_signatory ?? '',
            enable_signature_on_invoice: d.enable_signature_on_invoice ?? false,
            enable_shipping_on_invoice: d.enable_shipping_on_invoice ?? false,
            shipping_address: d.shipping_address ?? '',
            shipping_city: d.shipping_city ?? '',
            shipping_state: d.shipping_state ?? '',
            shipping_postal_code: d.shipping_postal_code ?? '',
            shipping_country: d.shipping_country ?? 'India',
          })
        }
      })
      .catch(() => setFormData(emptySettings))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement | HTMLTextAreaElement & { type?: string }
    if (type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess(false)
    try {
      await api.put('/settings', {
        company_name: formData.company_name || undefined,
        gstin: formData.gstin || undefined,
        pan: formData.pan || undefined,
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        website: formData.website || undefined,
        address_line1: formData.address_line1 || undefined,
        address_line2: formData.address_line2 || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        postal_code: formData.postal_code || undefined,
        country: formData.country || undefined,
        bank_account_number: formData.bank_account_number || undefined,
        bank_name: formData.bank_name || undefined,
        ifsc_code: formData.ifsc_code || undefined,
        terms_and_conditions: formData.terms_and_conditions || undefined,
        invoice_prefix: formData.invoice_prefix || undefined,
        invoice_next_number: formData.invoice_next_number,
        logo_url: formData.logo_url || undefined,
        upi_id: formData.upi_id || undefined,
        qr_code_url: formData.qr_code_url || undefined,
        authorized_signatory: formData.authorized_signatory || undefined,
        enable_signature_on_invoice: formData.enable_signature_on_invoice,
        enable_shipping_on_invoice: formData.enable_shipping_on_invoice,
        shipping_address: formData.shipping_address || undefined,
        shipping_city: formData.shipping_city || undefined,
        shipping_state: formData.shipping_state || undefined,
        shipping_postal_code: formData.shipping_postal_code || undefined,
        shipping_country: formData.shipping_country || undefined,
      })
      setSuccess(true)
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string }; message?: string } } })?.response?.data?.error?.message ||
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save'
      setError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your business details</p>
        </div>
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your business details</p>
      </div>

      <Card>
        <div className="border-b px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-lg md:text-xl font-semibold">Business Details</h2>
        </div>

        <form onSubmit={handleSave} className="p-4 md:p-6 space-y-4 md:space-y-6">
          {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
          {success && <p className="text-sm text-green-600 bg-green-50 p-2 rounded">Settings saved.</p>}

          <div className="grid gap-2">
            <Label htmlFor="company_name" className="text-sm font-medium">Business Name</Label>
            <Input id="company_name" name="company_name" value={formData.company_name} onChange={handleChange} className="h-10 md:h-9" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="gstin" className="text-sm font-medium">GSTIN</Label>
              <Input id="gstin" name="gstin" value={formData.gstin} onChange={handleChange} className="h-10 md:h-9 font-mono" placeholder="27AABCA1234G1Z0" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pan" className="text-sm font-medium">PAN</Label>
              <Input id="pan" name="pan" value={formData.pan} onChange={handleChange} className="h-10 md:h-9" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="h-10 md:h-9" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="h-10 md:h-9" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website" className="text-sm font-medium">Website</Label>
            <Input id="website" name="website" type="url" value={formData.website} onChange={handleChange} className="h-10 md:h-9" placeholder="https://example.com" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address_line1" className="text-sm font-medium">Address</Label>
            <Input id="address_line1" name="address_line1" value={formData.address_line1} onChange={handleChange} className="h-10 md:h-9" placeholder="Line 1" />
            <Input name="address_line2" value={formData.address_line2} onChange={handleChange} className="h-10 md:h-9" placeholder="Line 2 (optional)" />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="city" className="text-sm font-medium">City</Label>
              <Input id="city" name="city" value={formData.city} onChange={handleChange} className="h-10 md:h-9" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state" className="text-sm font-medium">State</Label>
              <Input id="state" name="state" value={formData.state} onChange={handleChange} className="h-10 md:h-9" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="postal_code" className="text-sm font-medium">Pincode</Label>
              <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleChange} className="h-10 md:h-9" />
            </div>
          </div>

          <div className="border-t pt-4 md:pt-6">
            <h3 className="text-base font-semibold mb-4">Bank Details</h3>
            <div className="grid gap-2">
              <Label htmlFor="bank_name" className="text-sm font-medium">Bank Name</Label>
              <Input id="bank_name" name="bank_name" value={formData.bank_name} onChange={handleChange} className="h-10 md:h-9" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 pt-3">
              <div className="grid gap-2">
                <Label htmlFor="bank_account_number" className="text-sm font-medium">Account Number</Label>
                <Input id="bank_account_number" name="bank_account_number" value={formData.bank_account_number} onChange={handleChange} className="h-10 md:h-9" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ifsc_code" className="text-sm font-medium">IFSC Code</Label>
                <Input id="ifsc_code" name="ifsc_code" value={formData.ifsc_code} onChange={handleChange} className="h-10 md:h-9 font-mono" />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 md:pt-6">
            <h3 className="text-base font-semibold mb-4">Payment & Invoice Details</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="upi_id" className="text-sm font-medium">UPI ID</Label>
                <Input id="upi_id" name="upi_id" value={formData.upi_id} onChange={handleChange} className="h-10 md:h-9" placeholder="name@upi" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qr_code_url" className="text-sm font-medium">QR Code URL</Label>
                <Input id="qr_code_url" name="qr_code_url" type="url" value={formData.qr_code_url} onChange={handleChange} className="h-10 md:h-9" placeholder="https://example.com/qr.png" />
              </div>
            </div>
            <div className="grid gap-2 pt-3">
              <Label htmlFor="logo_url" className="text-sm font-medium">Logo URL</Label>
              <Input id="logo_url" name="logo_url" type="url" value={formData.logo_url} onChange={handleChange} className="h-10 md:h-9" placeholder="https://example.com/logo.png" />
            </div>
            <div className="grid gap-2 pt-3">
              <Label htmlFor="authorized_signatory" className="text-sm font-medium">Authorized Signatory Name</Label>
              <Input id="authorized_signatory" name="authorized_signatory" value={formData.authorized_signatory} onChange={handleChange} className="h-10 md:h-9" />
            </div>
          </div>

          <div className="border-t pt-4 md:pt-6">
            <h3 className="text-base font-semibold mb-4">Invoice Options</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  id="enable_signature_on_invoice"
                  name="enable_signature_on_invoice"
                  type="checkbox"
                  checked={formData.enable_signature_on_invoice}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="enable_signature_on_invoice" className="text-sm font-medium cursor-pointer">Enable signature section on invoice</Label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="enable_shipping_on_invoice"
                  name="enable_shipping_on_invoice"
                  type="checkbox"
                  checked={formData.enable_shipping_on_invoice}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="enable_shipping_on_invoice" className="text-sm font-medium cursor-pointer">Enable shipping details on invoice</Label>
              </div>
            </div>
          </div>

          {formData.enable_shipping_on_invoice && (
            <div className="border-t pt-4 md:pt-6">
              <h3 className="text-base font-semibold mb-4">Default Shipping Address</h3>
              <div className="grid gap-2">
                <Label htmlFor="shipping_address" className="text-sm font-medium">Address</Label>
                <Input id="shipping_address" name="shipping_address" value={formData.shipping_address} onChange={handleChange} className="h-10 md:h-9" />
              </div>
              <div className="grid gap-4 md:grid-cols-3 pt-3">
                <div className="grid gap-2">
                  <Label htmlFor="shipping_city" className="text-sm font-medium">City</Label>
                  <Input id="shipping_city" name="shipping_city" value={formData.shipping_city} onChange={handleChange} className="h-10 md:h-9" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shipping_state" className="text-sm font-medium">State</Label>
                  <Input id="shipping_state" name="shipping_state" value={formData.shipping_state} onChange={handleChange} className="h-10 md:h-9" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="shipping_postal_code" className="text-sm font-medium">Pincode</Label>
                  <Input id="shipping_postal_code" name="shipping_postal_code" value={formData.shipping_postal_code} onChange={handleChange} className="h-10 md:h-9" />
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4 md:pt-6">
            <h3 className="text-base font-semibold mb-4">Invoice Numbering</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="invoice_prefix" className="text-sm font-medium">Invoice Prefix</Label>
                <Input id="invoice_prefix" name="invoice_prefix" value={formData.invoice_prefix} onChange={handleChange} className="h-10 md:h-9" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invoice_next_number" className="text-sm font-medium">Next Invoice Number</Label>
                <Input id="invoice_next_number" name="invoice_next_number" type="number" value={formData.invoice_next_number} onChange={handleChange} className="h-10 md:h-9" />
              </div>
            </div>
          </div>

          <div className="border-t pt-4 md:pt-6">
            <h3 className="text-base font-semibold mb-4">Terms & Conditions</h3>
            <div className="grid gap-2">
              <Label htmlFor="terms_and_conditions" className="text-sm font-medium">Terms & Conditions</Label>
              <Textarea id="terms_and_conditions" name="terms_and_conditions" value={formData.terms_and_conditions} onChange={handleChange} className="min-h-24 md:min-h-20 text-base md:text-sm" />
            </div>
          </div>

          <div className="flex gap-3 pt-4 md:pt-6 border-t">
            <Button type="submit" disabled={isSaving} className="w-full md:w-auto h-10 md:h-9">
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="border-b px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-lg md:text-xl font-semibold">Account</h2>
        </div>
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm md:text-base">Account Email</p>
              <p className="text-xs md:text-sm text-muted-foreground">{user?.email ?? '—'}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <Button variant="destructive" className="h-10 md:h-9" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
