import React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import ImageUploader from '@/components/shared/imageUploader'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EditRewardDialog({ reward, isOpen, onClose, onSave, isAddMode }) {
  const [formData, setFormData] = React.useState({
    rewardName: "",
    description: "",
    pointsRequired: 0,
    imageURL: "",
    deleted: false,
  })

  React.useEffect(() => {
    if (reward) {
      setFormData({
        rewardName: reward.rewardName || "",
        description: reward.description || "",
        pointsRequired: reward.pointsRequired || 0,
        imageURL: reward.imageURL || "",
        deleted: reward.deleted ?? false,
      })
    }
  }, [reward])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const updatedReward = {
      ...reward,
      ...formData,
      pointsRequired: Number(formData.pointsRequired),
    }
    onSave(updatedReward)
  }

  const handleChange = (field) => (e) => {
    const value = e.target?.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (imageURL) => {
    setFormData(prev => ({
      ...prev,
      imageURL
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isAddMode ? 'Add New Reward' : 'Edit Reward'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Label>Reward Image</Label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-gray-100">
                {formData.imageURL ? (
                  <img 
                    src={formData.imageURL} 
                    alt={formData.rewardName || "Reward preview"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="w-full">
                <ImageUploader
                  currentImageUrl={formData.imageURL}
                  onImageUploaded={handleImageUpload}
                  bucketName="rewardImages"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rewardName">Name</Label>
            <Input
              id="rewardName"
              value={formData.rewardName}
              onChange={handleChange('rewardName')}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange('description')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pointsRequired">Points Required</Label>
            <Input
              id="pointsRequired"
              type="number"
              value={formData.pointsRequired}
              onChange={handleChange('pointsRequired')}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={!formData.deleted}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, deleted: !checked }))
              }
            />
            <Label htmlFor="status">Active</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isAddMode ? 'Create Reward' : 'Update Reward'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
