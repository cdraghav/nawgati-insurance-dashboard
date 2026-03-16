"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function useAgents() {
  return useQuery({
    queryKey: ["agents"],
    queryFn: () => api.users.agents(),
    staleTime: 5 * 60_000,
  })
}
