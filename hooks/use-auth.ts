"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export function useAuth() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  async function logout() {
    clearAuth()
    router.push("/login")
  }

  return { user, logout }
}
