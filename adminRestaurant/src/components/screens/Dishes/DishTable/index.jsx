import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./DishesColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import EditDishDialog from "./EditDishDialog"
import { DishTableSkeleton } from "./DishTableSkeleton"

export default function Dishes() {
  const { data: dishes, isLoading, error, syncMutation, mutate } = useDataFetching('items', 'dishes')
  const [isSyncing, setIsSyncing] = React.useState(false)
  const [selectedDish, setSelectedDish] = React.useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)

  const handleSync = () => {
    setIsSyncing(true)
    syncMutation.mutate(null, {
      onSettled: () => setIsSyncing(false)
    })
  }

  const handleEditDish = (dish) => {
    console.log('handleEditDish called with:', dish)
    setSelectedDish(dish)
    setIsEditDialogOpen(true)
  }

  const handleSave = (updatedDish) => {
    const newDishes = dishes.map(dish => 
      dish.itemId === updatedDish.itemId ? updatedDish : dish
    )
    mutate(newDishes)
    setIsEditDialogOpen(false)
    setSelectedDish(null)
  }

  if (isLoading) return <DishTableSkeleton />

  if (error) return <div>An error occurred: {error.message}</div>

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Dishes' },
  ]

  return (
    <div className="container mx-auto py-2">
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Dishes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={dishes}
            columns={columns}
            filterColumn="name"
            onSync={handleSync}
            isSyncing={isSyncing}
            meta={{
              onEditDish: handleEditDish,
              updateData: handleSave
            }}
          />
        </CardContent>
      </Card>
      {selectedDish && (
        <EditDishDialog
          dish={selectedDish}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedDish(null)
          }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
