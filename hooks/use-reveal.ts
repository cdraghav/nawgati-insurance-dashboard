"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { VisitsResponse } from "@/lib/types"

export function useRevealMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (visitId: string) => api.leads.reveal(visitId),
    onSuccess: (lead) => {
      // Instantly update every cached visits page — no refetch needed
      queryClient.setQueriesData<VisitsResponse>(
        { queryKey: ["visits"], exact: false },
        (old) => {
          if (!old) return old
          return {
            ...old,
            visits: old.visits.map((v) =>
              v.id === lead.visitId
                ? {
                    ...v,
                    assignedTo: lead.assignedTo,
                    isAssigned: true,
                    isAssignedToMe: true,
                    isClaimable: false,
                  }
                : v
            ),
          }
        }
      )
    },
  })
}
