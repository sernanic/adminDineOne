import React from "react"
import { DataTable } from "@/components/shared/entityDataTable/EntityDataTable"
import { columns } from "./RewardsColumns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Breadcrumbs from "@/components/shared/Breadcrumbs"
import EditRewardDialog from "./EditRewardDialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import useMerchantStore from "@/stores/merchantStore"

export default function Rewards() {
  const { currentUser } = useAuth()
  const { toast } = useToast()
  const selectedMerchantId = useMerchantStore((state) => state.selectedMerchantId)
  const [rewards, setRewards] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState(null)
  const [selectedReward, setSelectedReward] = React.useState(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isAddMode, setIsAddMode] = React.useState(false)

  const fetchRewards = async () => {
    try {
      setIsLoading(true)
      const headers = { Authorization: `Bearer ${await currentUser.getIdToken()}` }
      const response = await axios.get(`http://127.0.0.1:4000/rewards/${selectedMerchantId}`, { headers })
      setRewards(response.data.rewards) // Access the nested rewards array
    } catch (err) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to fetch rewards",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    if (currentUser && selectedMerchantId) {
      fetchRewards()
    }
  }, [currentUser, selectedMerchantId])

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

  const handleSave = async (updatedReward) => {
    try {
      const headers = { Authorization: `Bearer ${await currentUser.getIdToken()}` }
      
      if (isAddMode) {
        // Create new reward
        const response = await axios.post('http://127.0.0.1:4000/rewards/', {
          ...updatedReward,
          merchantId: selectedMerchantId
        }, { headers })
        setRewards(prev => [...prev, response.data])
        toast({
          title: "Success",
          description: "Reward created successfully",
        })
      } else {
        // Update existing reward
        const response = await axios.put(`http://127.0.0.1:4000/rewards/${updatedReward.id}`, updatedReward, { headers })
        setRewards(prev => prev.map(reward => 
          reward.id === updatedReward.id ? response.data : reward
        ))
        toast({
          title: "Success",
          description: "Reward updated successfully",
        })
      }
      setIsEditDialogOpen(false)
      setSelectedReward(null)
    } catch (err) {
      toast({
        title: "Error",
        description: isAddMode ? "Failed to create reward" : "Failed to update reward",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (rewardId) => {
    try {
      const headers = { Authorization: `Bearer ${await currentUser.getIdToken()}` }
      await axios.delete(`http://127.0.0.1:4000/rewards/${rewardId}`, { headers })
      setRewards(prev => prev.filter(reward => reward.id !== rewardId))
      toast({
        title: "Success",
        description: "Reward deleted successfully",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete reward",
        variant: "destructive",
      })
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>An error occurred: {error}</div>

  const breadcrumbItems = [
    { label: 'Home', link: '/' },
    { label: 'Rewards' },
  ]

  return (
    <div className="flex flex-col w-full h-full p-4">
      <Breadcrumbs items={breadcrumbItems} />
      <div className="flex justify-center items-center mt-4" style={{width: '100%', height: '100%'}}>
        <div className="bg-white rounded-lg p-4 overflow-auto" style={{width: '95%', height: '85vh'}}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Rewards</h2>
            <Button onClick={handleAddReward} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Reward
            </Button>
          </div>
          <DataTable
            data={rewards}
            columns={columns}
            filterColumn="rewardName"
            meta={{
              onEditReward: handleEditReward,
              onDeleteReward: handleDelete,
              updateData: handleSave
            }}
          />
          
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
        </div>
      </div>
    </div>
  )
}
