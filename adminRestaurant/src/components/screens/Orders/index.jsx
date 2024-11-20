"use client"

import React, { useState } from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./OrdersColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import { OrderDetailsDialog } from "./OrderDetailsDialog"

export default function Orders() {
  const { data: orders, isLoading, error } = useDataFetching('orders', 'orders')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Orders' },
  ]

  return (
    <div className="container mx-auto py-2">
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={orders}
            columns={columns({ 
              onViewDetails: (order) => {
                setSelectedOrder(order)
                setIsDialogOpen(true)
              }
            })}
            filterColumn="orderId"
          />
        </CardContent>
      </Card>
      <OrderDetailsDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
      />
    </div>
  )
}
