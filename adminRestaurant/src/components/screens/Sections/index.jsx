import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./SectionsColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"

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

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Sections' },
  ]

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Sections</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={sections}
            columns={columns}
            filterColumn="name"
            onSync={handleSync}
            isSyncing={isSyncing}
          />
        </CardContent>
      </Card>
    </div>
  )
}
