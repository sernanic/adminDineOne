"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getAuth } from 'firebase/auth'
import axios from 'axios'

export function OrderDetailsDialog({ isOpen, onOpenChange, order }) {
  const [lineItems, setLineItems] = React.useState([])

  React.useEffect(() => {
    const fetchLineItems = async () => {
      if (isOpen && order) {
        try {
          const auth = getAuth()
          const user = auth.currentUser
          if (!user) throw new Error('User not authenticated')
          
          const token = await user.getIdToken()
          const response = await axios.get(
            `http://127.0.0.1:4000/orders/${order.orderId}/lineItems`,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          )
          console.log('API Response:', response.data)
          const items = Array.isArray(response.data) ? response.data : response.data.lineItems || []
          console.log('Processed Items:', items)
          setLineItems(items)
        } catch (error) {
          console.error('Failed to fetch line items:', error)
          setLineItems([])
        }
      }
    }
    fetchLineItems()
  }, [isOpen, order])

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-6">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-2xl font-bold text-gray-800">Order Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-6">
          {/* Order Info Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-medium text-gray-900">{order.orderId}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Employee</p>
              <p className="font-medium text-gray-900">{order.employeeName}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Total</p>
              <p className="font-medium text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(order.total / 100)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">State</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                ${order.state.toLowerCase() === 'open' ? 'bg-green-100 text-green-800' : 
                  order.state.toLowerCase() === 'closed' ? 'bg-gray-100 text-gray-800' : 
                  'bg-blue-100 text-blue-800'}`}>
                {order.state}
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="font-medium text-gray-900">
                {new Date(order.createdTime).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Line Items Section */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Line Items</h3>
            <div className="bg-white rounded-lg border overflow-hidden">
              <div className="max-h-[400px] overflow-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Note</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {lineItems.map((item) => (
                      <tr key={item.lineItemId} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{item.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: "USD",
                          }).format(item.price / 100)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {new Date(item.createdTime).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">{item.note || '-'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${item.refunded ? 'bg-red-100 text-red-800' : 
                              item.exchanged ? 'bg-yellow-100 text-yellow-800' : 
                              item.printed ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'}`}>
                            {item.refunded ? 'Refunded' : 
                             item.exchanged ? 'Exchanged' : 
                             item.printed ? 'Printed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 