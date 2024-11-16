import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import ImageUploader from '@/components/shared/imageUploader'

const defaultFeature = {
  name: "",
  description: "",
  imageURL: "",
  itemId: "",
}

export default function EditFeatureDialog({
  isOpen,
  onClose,
  onSave,
  feature,
  isAddMode,
}) {
  const [formData, setFormData] = useState({
    ...defaultFeature,
    ...feature,
  })

  useEffect(() => {
    if (feature) {
      setFormData({
        ...defaultFeature,
        ...feature,
        itemId: feature.itemId ?? "",
      })
    }
  }, [feature])

  const handleSubmit = (e) => {
    e.preventDefault()
    const submissionData = {
      ...formData,
      itemId: formData.itemId === "" ? null : Number(formData.itemId),
    }
    onSave(submissionData)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (imageURL) => {
    setFormData(prev => ({
      ...prev,
      imageURL
    }))
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={() => {
        setFormData({
          ...defaultFeature,
          ...feature,
          itemId: feature?.itemId ?? "",
        })
        onClose()
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isAddMode ? "Add New Feature" : "Edit Feature"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Label>Feature Image</Label>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-40 h-40 rounded-lg overflow-hidden bg-gray-100">
                {formData.imageURL ? (
                  <img 
                    src={formData.imageURL} 
                    alt={formData.name || "Feature preview"} 
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
                  bucketName="featuresImages"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemId">Item ID</Label>
            <Input
              id="itemId"
              name="itemId"
              type="number"
              value={formData.itemId || ""}
              onChange={handleChange}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
