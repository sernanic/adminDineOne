"use client"

import React, { useState } from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./OrdersColumns"
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
    <div className="flex flex-col w-full h-full p-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-center items-center mt-4" style={{width: '100%', height: '100%'}}>
        <div className="bg-white rounded-lg p-4 overflow-auto" style={{width: '95%', height: '85vh'}}>
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
        </div>
      </div>
      <OrderDetailsDialog 
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        order={selectedOrder}
      />
    </div>
  )
}
