"use client"

import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { usePreferencesStore } from "@/lib/preferences-store"

interface UseVisitsParams {
  page?: number
  limit?: number
  assignedToId?: number
  timeRange?: "today" | "thisWeek"
  regType?: "commercial" | "private"
  vehicleType?: string
  insuranceExpiryFrom?: string
  insuranceExpiryTo?: string
}

export function useVisits({
  page = 1,
  limit = 25,
  assignedToId,
  timeRange,
  regType,
  vehicleType,
  insuranceExpiryFrom,
  insuranceExpiryTo,
}: UseVisitsParams = {}) {
  const refreshInterval = usePreferencesStore((s) => s.refreshInterval)
  return useQuery({
    queryKey: ["visits", page, limit, assignedToId, timeRange, regType, vehicleType, insuranceExpiryFrom, insuranceExpiryTo],
    queryFn: ({ signal }) =>
      api.visits.list(page, limit, {
        ...(assignedToId != null ? { assignedTo: assignedToId } : {}),
        ...(timeRange ? { timeRange } : {}),
        ...(regType ? { regType } : {}),
        ...(vehicleType ? { vehicleType } : {}),
        ...(insuranceExpiryFrom ? { insuranceExpiryFrom } : {}),
        ...(insuranceExpiryTo ? { insuranceExpiryTo } : {}),
      }, signal),
    staleTime: 30_000,
    refetchInterval: refreshInterval > 0 ? refreshInterval : false,
    placeholderData: keepPreviousData,
  })
}
