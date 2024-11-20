import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { columns } from "./RewardsColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import EditRewardDialog from "./EditRewardDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/hooks/use-toast"
import useMerchantStore from "@/stores/merchantStore"
import { useRewards } from "./hooks/useRewards"

export default function Rewards() {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const selectedMerchantId = useMerchantStore((state) => state.selectedMerchantId)
  const [selectedReward, setSelectedReward] = React.useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddMode, setIsAddMode] = React.useState(false)

  const { 
    rewards, 
    isLoading, 
    error,
    createReward,
    updateReward,
    deleteReward 
  } = useRewards({ currentUser, selectedMerchantId })

  const handleEditReward = (reward) => {
    setIsAddMode(false)
    setSelectedReward(reward)
    setIsEditDialogOpen(true)
  }

  const handleAddReward = () => {
    setIsAddMode(true)
    setSelectedReward({
      rewardName: "",
      description: "",
      pointsRequired: 0,
      imageURL: "",
      deleted: false,
    })
    setIsEditDialogOpen(true)
  }

  const handleSave = async (reward) => {
    if (isAddMode) {
      createReward(reward)
    } else {
      updateReward(reward)
    }
    setIsEditDialogOpen(false)
    setSelectedReward(null)
  }

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch rewards",
      variant: "destructive",
    })
  }

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Rewards' },
  ]

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-2">
      <Breadcrumbs items={breadcrumbItems} />
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={rewards}
            isLoading={isLoading}
            filterColumn="rewardName"
            meta={{
              onEditReward: handleEditReward,
              onDeleteReward: deleteReward,
              updateData: handleSave
            }}
            moreActions={[
              {
                label: "Add Reward",
                onClick: handleAddReward
              }
            ]}
          />
        </CardContent>
      </Card>

      {selectedReward && (
        <EditRewardDialog
          reward={selectedReward}
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedReward(null)
          }}
          onSave={handleSave}
          isAddMode={isAddMode}
        />
      )}
    </div>
  )
}
