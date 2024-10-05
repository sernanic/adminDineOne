import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./DishesColumns" // Move column definitions to a separate file
// Add import for Card components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Dishes() {
  const { data: dishes, isLoading, error, syncMutation } = useDataFetching('items', 'dishes')

  const [isSyncing, setIsSyncing] = React.useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    syncMutation.mutate(null, {
      onSettled: () => setIsSyncing(false)
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  return (
    <div className="flex justify-center items-center" style={{width: '100%', height: '100%'}}>
    <div className="bg-white rounded-lg p-4" style={{width: '95%', height: '90%'}}>
      <DataTable
        data={dishes}
        columns={columns}
        filterColumn="name"
        onSync={handleSync}
        isSyncing={isSyncing}
      />
    </div>
    </div>
  )
}