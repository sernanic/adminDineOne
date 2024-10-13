import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useMerchantStore = create(
  persist(
    (set) => ({
      selectedMerchantId: null,
      setSelectedMerchantId: (merchantId) => set({ selectedMerchantId: merchantId }),
    }),
    {
      name: 'merchant-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useMerchantStore;
