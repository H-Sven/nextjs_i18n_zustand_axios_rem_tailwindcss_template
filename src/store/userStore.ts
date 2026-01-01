import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface UserState {
  token: string | null
  userInfo: any | null
  setToken: (token: string) => void
  setUserInfo: (info: any) => void
  logout: () => void
}

/**
 * 用户状态 Store
 * 支持持久化到 localStorage
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      token: null,
      userInfo: null,
      setToken: (token) => set({ token }),
      setUserInfo: (info) => set({ userInfo: info }),
      logout: () => set({ token: null, userInfo: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage), // 默认使用 localStorage
    },
  ),
)
