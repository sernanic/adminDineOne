import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./CustomerColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import CustomerTableSkeleton from "./CustomerTableSkeleton"
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";

export default function CustomersTable() {
  const { merchantId } = useParams();
  const { currentUser } = useAuth();
  const { data: rawData, isLoading, error, syncMutation } = useDataFetching('customers', 'customers')
  const [isSyncing, setIsSyncing] = React.useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    syncMutation.mutate(null, {
      onSettled: () => setIsSyncing(false)
    })
  }

  if (isLoading) return <CustomerTableSkeleton />

  if (error) return <div>An error occurred: {error.message}</div>

  // Ensure we have an array of customers
  const customers = Array.isArray(rawData) ? rawData : []
  console.log('Customers before DataTable:', customers)

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Customers' },
  ]

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable 
            columns={columns} 
            data={customers} 
            filterColumn="email"
            onSync={handleSync}
            isSyncing={isSyncing}
          />
        </CardContent>
      </Card>
    </div>
  )
}
