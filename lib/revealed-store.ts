import { create } from "zustand"

export type RevealedDetails = {
  vehicleNumber: string
  vehiclePhone: string | null
  phoneNumber: string | null
  phoneAnimDone: boolean
}

interface RevealedStore {
  revealed: Record<string, RevealedDetails>
  setRevealed: (id: string, details: RevealedDetails) => void
  revealPhone: (id: string, phoneNumber: string | null) => void
  markPhoneAnimDone: (id: string) => void
  clearRevealed: (id: string) => void
}

export const useRevealedStore = create<RevealedStore>((set) => ({
  revealed: {},
  setRevealed: (id, details) =>
    set((s) => ({ revealed: { ...s.revealed, [id]: details } })),
  revealPhone: (id, phoneNumber) =>
    set((s) => ({
      revealed: { ...s.revealed, [id]: { ...s.revealed[id], phoneNumber, phoneAnimDone: false } },
    })),
  markPhoneAnimDone: (id) =>
    set((s) => ({
      revealed: { ...s.revealed, [id]: { ...s.revealed[id], phoneAnimDone: true } },
    })),
  clearRevealed: (id) =>
    set((s) => {
      const next = { ...s.revealed }
      delete next[id]
      return { revealed: next }
    }),
}))
