import { create } from "zustand"

export type RevealedDetails = {
  vehicleNumber: string
  phoneNumber: string
}

interface RevealedStore {
  revealed: Record<string, RevealedDetails>
  setRevealed: (id: string, details: RevealedDetails) => void
  clearRevealed: (id: string) => void
}

export const useRevealedStore = create<RevealedStore>((set) => ({
  revealed: {},
  setRevealed: (id, details) =>
    set((s) => ({ revealed: { ...s.revealed, [id]: details } })),
  clearRevealed: (id) =>
    set((s) => {
      const next = { ...s.revealed }
      delete next[id]
      return { revealed: next }
    }),
}))
