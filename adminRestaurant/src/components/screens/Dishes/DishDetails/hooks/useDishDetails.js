import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { 
  fetchDishDetails, 
  fetchDishImages, 
  addDishImage, 
  deleteDishImage 
} from "./api"

export function useDishDetails({ currentUser, merchantId, itemId }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const dishQuery = useQuery({
    queryKey: ['dish', merchantId, itemId],
    queryFn: () => fetchDishDetails({ 
      merchantId, 
      itemId,
      currentUser 
    }),
    enabled: !!currentUser && !!merchantId && !!itemId,
  })

  const imagesQuery = useQuery({
    queryKey: ['dishImages', merchantId, itemId],
    queryFn: () => fetchDishImages({ 
      merchantId, 
      itemId,
      currentUser 
    }),
    enabled: !!currentUser && !!merchantId && !!itemId,
  })

  const addImageMutation = useMutation({
    mutationFn: (imageURL) => addDishImage({ 
      merchantId, 
      itemId, 
      imageURL,
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['dishImages', merchantId, itemId])
      toast({
        title: "Success",
        description: "Image added successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to add image",
        variant: "destructive",
      })
    }
  })

  const deleteImageMutation = useMutation({
    mutationFn: (imageId) => deleteDishImage({ 
      merchantId,
      itemId,
      imageId, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['dishImages', merchantId, itemId])
      toast({
        title: "Success",
        description: "Image deleted successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete image",
        variant: "destructive",
      })
    }
  })

  return {
    dish: dishQuery.data,
    dishImages: imagesQuery.data,
    isLoading: dishQuery.isLoading,
    error: dishQuery.error,
    imagesError: imagesQuery.error,
    isImagesLoading: imagesQuery.isLoading,
    addImage: addImageMutation.mutate,
    deleteImage: deleteImageMutation.mutate,
    isAddingImage: addImageMutation.isLoading,
    isDeletingImage: deleteImageMutation.isLoading,
  }
}
