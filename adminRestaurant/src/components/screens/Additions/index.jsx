import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./AdditionsColumns"
import Breadcrumbs from "@/components/shared/Breadcrumbs"

export default function Additions() {
  const { data: additions, isLoading, error, syncMutation } = useDataFetching('modifierGroups', 'additions')
  const [isSyncing, setIsSyncing] = React.useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    syncMutation.mutate(null, {
      onSettled: () => setIsSyncing(false)
    })
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Additions' },
  ]

  return (
    <div className="flex flex-col w-full h-full p-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-center items-center mt-4" style={{width: '100%', height: '100%'}}>
      <div className="bg-white rounded-lg p-4 overflow-auto" style={{width: '95%', height: '85vh'}}>
      <DataTable
            data={additions}
            columns={columns}
            filterColumn="name"
            onSync={handleSync}
            isSyncing={isSyncing}
          />
        </div>
      </div>
    </div>
  )
}
