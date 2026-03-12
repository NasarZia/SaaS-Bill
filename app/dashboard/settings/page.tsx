'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Save } from 'lucide-react'

export default function SettingsPage() {
  const [formData, setFormData] = useState({
    businessName: 'My Business',
    businessType: 'Retail',
    gstin: '27AABCA1234G1Z0',
    email: 'business@example.com',
    phone: '+91-9876543210',
    address: '123 Business Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-sm md:text-base text-muted-foreground">Manage your business details</p>
      </div>

      {/* Business Details Section */}
      <Card>
        <div className="border-b px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-lg md:text-xl font-semibold">Business Details</h2>
        </div>

        <form className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Business Name */}
          <div className="grid gap-2">
            <Label htmlFor="businessName" className="text-sm font-medium">
              Business Name
            </Label>
            <Input
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="h-10 md:h-9"
            />
          </div>

          {/* Business Type & GSTIN - Side by side on desktop */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="businessType" className="text-sm font-medium">
                Business Type
              </Label>
              <Input
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                className="h-10 md:h-9"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gstin" className="text-sm font-medium">
                GSTIN
              </Label>
              <Input
                id="gstin"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className="h-10 md:h-9 font-mono"
                placeholder="27AABCA1234G1Z0"
              />
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="h-10 md:h-9"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="h-10 md:h-9"
              />
            </div>
          </div>

          {/* Address */}
          <div className="grid gap-2">
            <Label htmlFor="address" className="text-sm font-medium">
              Address
            </Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="min-h-24 md:min-h-20 text-base md:text-sm"
            />
          </div>

          {/* City, State & Pincode */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="city" className="text-sm font-medium">
                City
              </Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="h-10 md:h-9"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="state" className="text-sm font-medium">
                State
              </Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="h-10 md:h-9"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pincode" className="text-sm font-medium">
                Pincode
              </Label>
              <Input
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                className="h-10 md:h-9"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-3 pt-4 md:pt-6 border-t">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full md:w-auto h-10 md:h-9"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="outline" className="w-full md:w-auto h-10 md:h-9">
              Cancel
            </Button>
          </div>
        </form>
      </Card>

      {/* Account Section */}
      <Card>
        <div className="border-b px-4 py-3 md:px-6 md:py-4">
          <h2 className="text-lg md:text-xl font-semibold">Account</h2>
        </div>
        <div className="p-4 md:p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-sm md:text-base">Account Email</p>
              <p className="text-xs md:text-sm text-muted-foreground">user@example.com</p>
            </div>
            <Button variant="outline" size="sm" className="h-9 md:h-8">
              Change
            </Button>
          </div>
          <div className="border-t pt-4">
            <Button variant="destructive" className="h-10 md:h-9">
              Logout
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
