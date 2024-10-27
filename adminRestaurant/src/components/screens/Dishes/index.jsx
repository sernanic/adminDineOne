import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { useDataFetching } from "@/components/shared/entityDataTable/entityDataFetching"
import { columns } from "./DishesColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import EditDishDialog from "./EditDishDialog"

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
    console.log('handleEditDish called with:', dish) // Add debug log
    setSelectedDish(dish)
    setIsEditDialogOpen(true)
  }

  const handleSave = (updatedDish) => {
    const newDishes = dishes.map(dish => 
      dish.itemId === updatedDish.itemId ? updatedDish : dish
    )
    mutate(newDishes)
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error.message}</div>

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Dishes' },
  ]

  return (
    <div className="flex flex-col w-full h-full p-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-center items-center mt-4" style={{width: '100%', height: '100%'}}>
        <div className="bg-white rounded-lg p-4 overflow-auto" style={{width: '95%', height: '85vh'}}>
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
          
          <EditDishDialog
            dish={selectedDish}
            isOpen={isEditDialogOpen}
            onClose={() => {
                setIsEditDialogOpen(false)
                setSelectedDish(null)
            }}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  )
}
