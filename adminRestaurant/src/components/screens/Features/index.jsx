import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { columns } from "./FeaturesColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import EditFeatureDialog from "./EditFeatureDialog"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import useMerchantStore from "@/stores/merchantStore"
import { useFeatures } from "./useFeatures"

export default function Features() {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const selectedMerchantId = useMerchantStore((state) => state.selectedMerchantId)
  const [selectedFeature, setSelectedFeature] = React.useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddMode, setIsAddMode] = React.useState(false)

  const { 
    features, 
    isLoading, 
    error,
    createFeature,
    updateFeature,
    deleteFeature 
  } = useFeatures({ currentUser, selectedMerchantId })

  const handleEditFeature = (feature) => {
    setIsAddMode(false)
    setSelectedFeature(feature)
    setIsEditDialogOpen(true)
  }

  const handleAddFeature = () => {
    setIsAddMode(true)
    setSelectedFeature({
      name: "",
      description: "",
      imageURL: "",
      itemId: null,
    })
    setIsEditDialogOpen(true)
  }

  const handleSave = (feature) => {
    if (isAddMode) {
      createFeature(feature)
    } else {
      updateFeature(feature)
    }
    setIsEditDialogOpen(false)
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch features",
      variant: "destructive",
    })
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Features' },
  ]

  return (
    <div className="container mx-auto py-10">
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Features</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={features}
            isLoading={isLoading}
            filterColumn="name"
            meta={{
              onEdit: handleEditFeature,
              onDelete: deleteFeature,
            }}
            moreActions={[
              {
                label: "Add Feature",
                onClick: handleAddFeature
              }
            ]}
          />
        </CardContent>
      </Card>

      <EditFeatureDialog
        key={selectedFeature?.id || 'new'}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
          setSelectedFeature(null)
        }}
        onSave={handleSave}
        feature={selectedFeature}
        isAddMode={isAddMode}
      />
    </div>
  )
}
