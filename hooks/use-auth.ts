"use client"

import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { api } from "@/lib/api"

export function useAuth() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  async function logout() {
    try {
      await api.auth.signout()
    } catch {}
    clearAuth()
    router.push("/login")
  }

  return { user, logout }
}
