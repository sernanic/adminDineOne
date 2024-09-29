import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { getAuth } from 'firebase/auth'

export function useDataFetching(endpoint, queryKey) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const merchantId = '6JDE8MZSA6FJ1' // Replace with actual merchant ID
      const response = await axios.get(`http://127.0.0.1:4000/${endpoint}/${merchantId}`)
      console.log('API response:', response.data) // Add this line
      // Return an empty array if the data is undefined
      return response.data[endpoint] || []
    },
  })

  console.log('Fetched data:', data) // Add this line

  const syncMutation = useMutation({
    mutationFn: async () => {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) {
        throw new Error('User not authenticated')
      }
      const token = await user.getIdToken()
      return axios.post(`http://127.0.0.1:4000/sync/${endpoint}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey])
      console.log(`${queryKey} synced successfully`)
    },
    onError: (error) => {
      console.error(`Error syncing ${queryKey}:`, error)
    },
  })

  return { data, isLoading, error, syncMutation }
}