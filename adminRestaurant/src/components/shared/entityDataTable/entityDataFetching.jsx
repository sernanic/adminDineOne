import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuth } from 'firebase/auth'
import useMerchantStore from '../../../stores/merchantStore'

export function useDataFetching(endpoint, queryKey) {
  const queryClient = useQueryClient()
  const selectedMerchantId = useMerchantStore(state => state.selectedMerchantId)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [endpoint, selectedMerchantId],
    queryFn: async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      if (!selectedMerchantId) {
        throw new Error('No merchant selected')
      }
      const token = await user.getIdToken()
      const response = await axios.get(`http://127.0.0.1:4000/${endpoint}/${selectedMerchantId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('API response:', response.data)
      return response.data[endpoint] || []
    },
    enabled: !!selectedMerchantId,
  })

  const syncMutation = useMutation({
    mutationFn: async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      const token = await user.getIdToken()
      const response = await axios.post(`http://127.0.0.1:4000/sync/${endpoint}/${selectedMerchantId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      // Immediately refetch after successful sync
      await refetch()
      return response
    },
    onError: (error) => {
      console.error(`Error syncing ${endpoint}:`, error)
    }
  })

  const handleSync = async () => {
    try {
      await syncMutation.mutateAsync()
    } catch (error) {
      console.error('Sync failed:', error)
    }
  }

  return { 
    data, 
    isLoading, 
    error, 
    syncMutation,
    handleSync,
    isRefetching: syncMutation.isLoading,
  }
}
