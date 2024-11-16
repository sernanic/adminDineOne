import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { fetchRewards, createReward, updateReward, deleteReward } from "./api"

export function useRewards({ currentUser, selectedMerchantId }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['rewards', selectedMerchantId],
    queryFn: () => fetchRewards({ 
      merchantId: selectedMerchantId, 
      currentUser 
    }),
    enabled: !!currentUser && !!selectedMerchantId,
  })

  const createMutation = useMutation({
    mutationFn: (reward) => createReward({ 
      reward: { ...reward, merchantId: selectedMerchantId }, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['rewards'])
      toast({
        title: "Success",
        description: "Reward created successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create reward",
        variant: "destructive",
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (reward) => updateReward({ 
      reward, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['rewards'])
      toast({
        title: "Success",
        description: "Reward updated successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update reward",
        variant: "destructive",
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (rewardId) => deleteReward({ 
      rewardId, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['rewards'])
      toast({
        title: "Success",
        description: "Reward deleted successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete reward",
        variant: "destructive",
      })
    }
  })

  return {
    rewards: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createReward: createMutation.mutate,
    updateReward: updateMutation.mutate,
    deleteReward: deleteMutation.mutate,
    isCreating: createMutation.isLoading,
    isUpdating: updateMutation.isLoading,
    isDeleting: deleteMutation.isLoading,
  }
}
