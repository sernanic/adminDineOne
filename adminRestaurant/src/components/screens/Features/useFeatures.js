import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { fetchFeatures, createFeature, updateFeature, deleteFeature } from "./api"

export function useFeatures({ currentUser, selectedMerchantId }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['features', selectedMerchantId],
    queryFn: () => fetchFeatures({ 
      merchantId: selectedMerchantId, 
      currentUser 
    }),
    enabled: !!currentUser && !!selectedMerchantId,
  })

  const createMutation = useMutation({
    mutationFn: (feature) => createFeature({ 
      feature: { ...feature, merchantId: selectedMerchantId }, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['features'])
      toast({
        title: "Success",
        description: "Feature created successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create feature",
        variant: "destructive",
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (feature) => updateFeature({ 
      feature, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['features'])
      toast({
        title: "Success",
        description: "Feature updated successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update feature",
        variant: "destructive",
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (featureId) => deleteFeature({ 
      featureId, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['features'])
      toast({
        title: "Success",
        description: "Feature deleted successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete feature",
        variant: "destructive",
      })
    }
  })

  return {
    features: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createFeature: createMutation.mutate,
    updateFeature: updateMutation.mutate,
    deleteFeature: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  }
}
