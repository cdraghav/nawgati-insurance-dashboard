import { create } from "zustand"
import { persist } from "zustand/middleware"

interface PreferencesState {
  refreshInterval: number
  setRefreshInterval: (ms: number) => void
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      refreshInterval: 60_000,
      setRefreshInterval: (ms) => set({ refreshInterval: ms }),
    }),
    { name: "nawgati-preferences" }
  )
)
