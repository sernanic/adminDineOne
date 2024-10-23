import { create } from 'zustand';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,
  fetchUser: async () => {
    set({ loading: true, error: null });
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }
      
      const token = await currentUser.getIdToken();
      const response = await axios.get(`http://127.0.0.1:4000/user/${currentUser.uid}/view`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      set({ user: response.data, loading: false });
      console.log('Fetched user:', response.data); // Added console log
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  clearUser: () => set({ user: null, error: null }),
}));

export default useUserStore;
