'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import Link from 'next/link'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  gstin?: string
}

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data
  const customers: Customer[] = [
    {
      id: '1',
      name: 'ABC Industries',
      email: 'contact@abcindustries.com',
      phone: '+91-9876543210',
      address: '123 Business Street',
      city: 'Mumbai',
      gstin: '27AABCA1234G1Z0',
    },
    {
      id: '2',
      name: 'XYZ Trading',
      email: 'info@xyztrading.com',
      phone: '+91-9876543211',
      address: '456 Commerce Road',
      city: 'Delhi',
      gstin: '07AABCB2345G1Z0',
    },
    {
      id: '3',
      name: 'Tech Solutions',
      email: 'hello@techsol.com',
      phone: '+91-9876543212',
      address: '789 Tech Park',
      city: 'Bangalore',
      gstin: '29AABCC3456G1Z0',
    },
  ]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Customers</h1>
          <p className="text-sm md:text-base text-muted-foreground">Manage your customer list</p>
        </div>
        <Button className="w-full md:w-auto h-10 md:h-9">
          <Plus className="h-4 w-4 mr-2" />
          New Customer
        </Button>
      </div>

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

      {filteredCustomers.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No customers found. Try a different search.</p>
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
                    <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                    <td className="px-4 py-3">{customer.phone}</td>
                    <td className="px-4 py-3">{customer.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon-sm">
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon-sm">
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
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon-sm">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{customer.phone}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">City:</span>
                      <span className="font-medium">{customer.city}</span>
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
    </div>
  )
}
