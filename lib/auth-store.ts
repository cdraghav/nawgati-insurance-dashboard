import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  name: string
  email: string
}

interface AuthState {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const CREDENTIALS = {
  email: "admin@nawgati.com",
  password: "nawgati@123",
  name: "Admin User",
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, password) => {
        if (
          email === CREDENTIALS.email &&
          password === CREDENTIALS.password
        ) {
          set({ user: { name: CREDENTIALS.name, email: CREDENTIALS.email } })
          return true
        }
        return false
      },
      logout: () => set({ user: null }),
    }),
    { name: "insurance-auth" }
  )
)
