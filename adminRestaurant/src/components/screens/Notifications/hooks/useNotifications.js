import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { fetchNotifications, createNotification, updateNotification, deleteNotification } from "./api"

export function useNotifications({ currentUser, selectedMerchantId }) {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['notifications', selectedMerchantId],
    queryFn: () => fetchNotifications({ 
      merchantId: selectedMerchantId, 
      currentUser 
    }),
    enabled: !!currentUser && !!selectedMerchantId,
  })

  const createMutation = useMutation({
    mutationFn: (notification) => createNotification({ 
      notification: { ...notification, merchantId: selectedMerchantId }, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast({
        title: "Success",
        description: "Notification created successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create notification",
        variant: "destructive",
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: (notification) => updateNotification({ 
      notification, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast({
        title: "Success",
        description: "Notification updated successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification",
        variant: "destructive",
      })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (notificationId) => deleteNotification({ 
      notificationId, 
      currentUser 
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications'])
      toast({
        title: "Success",
        description: "Notification deleted successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      })
    }
  })

  return {
    notifications: query.data || [],
    isLoading: query.isLoading || createMutation.isLoading || updateMutation.isLoading || deleteMutation.isLoading,
    error: query.error,
    createNotification: createMutation.mutate,
    updateNotification: updateMutation.mutate,
    deleteNotification: deleteMutation.mutate,
  }
}
