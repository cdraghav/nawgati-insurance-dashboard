"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export function useAuth() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const storeLogout = useAuthStore((s) => s.logout)

  function logout() {
    storeLogout()
    router.push("/login")
  }

  return { user, logout }
}
