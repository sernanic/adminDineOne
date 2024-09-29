import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./SectionsColumns"

export default function Sections() {
  const { data: sections, isLoading, error, syncMutation } = useDataFetching('categories', 'sections')
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
    <DataTable
      data={sections}
      columns={columns}
      filterColumn="name"
      onSync={handleSync}
      isSyncing={isSyncing}
    />
  )
}
