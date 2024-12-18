import React from "react"
import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@nextui-org/react"
import { Checkbox } from "@nextui-org/react"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getAuth } from "firebase/auth"
import { Textarea } from "@nextui-org/react"

export function EditDishDialog({ dish, isOpen, onClose, onSave }) {
  const { toast } = useToast()
  const { control, register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      itemId: dish?.itemId || '',
      merchantId: dish?.merchantId || '',
      name: dish?.name || '',
      description: dish?.description || '',
      price: dish?.price ? (dish.price / 100).toFixed(2) : '',
      hidden: dish?.hidden || false,
      available: dish?.available || true,
      isPopular: dish?.isPopular || false,
    }
  })

  // Reset form when dish changes
  React.useEffect(() => {
    if (dish) {
      reset({
        itemId: dish.itemId || '',
        merchantId: dish.merchantId || '',
        name: dish.name || '',
        description: dish.description || '',
        price: dish.price ? (dish.price / 100).toFixed(2) : '',
        hidden: dish.hidden || false,
        available: dish.available || true,
        isPopular: dish.isPopular || false,
      })
    }
  }, [dish, reset])

  const onSubmit = async (data) => {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      const idToken = await user.getIdToken()
      
      const response = await fetch('http://127.0.0.1:4000/api/item/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          ...data,
          description: data.description || '',
          price: Math.round(parseFloat(data.price) * 100),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update dish')
      }

      const result = await response.json()
      onSave(result.item)
      onClose()
      toast({
        title: "Success",
        description: "Dish updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Dish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              label="Name"
              {...register("name", { required: "Name is required" })}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
          </div>

          <div className="space-y-2">
            <Input
              label="Price ($)"
              type="number"
              step="0.01"
              {...register("price", { 
                required: "Price is required",
                min: { value: 0, message: "Price must be positive" }
              })}
              isInvalid={!!errors.price}
              errorMessage={errors.price?.message}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              label="Description"
              {...register("description")}
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
              minRows={3}
              maxRows={5}
              className="w-full"
              placeholder="Enter dish description..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="available"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  isSelected={value}
                  onValueChange={onChange}
                >
                  Available
                </Checkbox>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="hidden"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  isSelected={value}
                  onValueChange={onChange}
                >
                  Hidden
                </Checkbox>
              )}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Controller
              name="isPopular"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  isSelected={value}
                  onValueChange={onChange}
                >
                  Popular
                </Checkbox>
              )}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditDishDialog;
