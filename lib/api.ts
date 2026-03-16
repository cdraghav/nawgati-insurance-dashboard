import type { AgentsResponse, AuthResponse, Lead, LeadStatus, LeadsResponse, Visit, VisitsResponse } from "./types"
import { axiosInstance } from "./axios"
import { ENDPOINTS } from "./constants"

export const api = {
  auth: {
    signin: (email: string, password: string) =>
      axiosInstance
        .post<AuthResponse>(ENDPOINTS.auth.signin, { email, password })
        .then((r) => r.data),

    signout: () =>
      axiosInstance
        .post<{ success: boolean }>(ENDPOINTS.auth.signout)
        .then((r) => r.data),
  },

  users: {
    get: (id: number) =>
      axiosInstance.get(ENDPOINTS.users.get(id)).then((r) => r.data),

    update: (id: number, payload: Record<string, unknown>) =>
      axiosInstance.put(ENDPOINTS.users.update(id), payload).then((r) => r.data),

    agents: () =>
      axiosInstance.get<AgentsResponse>(ENDPOINTS.users.agents).then((r) => r.data.agents),
  },

  visits: {
    list: (
      page = 1,
      limit = 25,
      filters?: {
        assignedTo?: number
        timeRange?: string
        regType?: string
        vehicleType?: string
        insuranceExpiryFrom?: string
        insuranceExpiryTo?: string
      },
      signal?: AbortSignal
    ) =>
      axiosInstance
        .get<VisitsResponse>(ENDPOINTS.visits.list, {
          params: { page, limit, ...filters },
          signal,
        })
        .then((r) => r.data),

    get: (visitId: string) =>
      axiosInstance
        .get<Visit>(ENDPOINTS.visits.get(visitId))
        .then((r) => r.data),
  },

  leads: {
    reveal: (visitId: string) =>
      axiosInstance
        .post<Lead>(ENDPOINTS.leads.reveal, { visitId })
        .then((r) => r.data),

    list: (page = 1, limit = 20, status?: LeadStatus) =>
      axiosInstance
        .get<LeadsResponse>(ENDPOINTS.leads.list, {
          params: { page, limit, ...(status ? { status } : {}) },
        })
        .then((r) => r.data),

    get: (id: number) =>
      axiosInstance
        .get<Lead>(ENDPOINTS.leads.get(id))
        .then((r) => r.data),

    updateStatus: (id: number, status: LeadStatus, note?: string) =>
      axiosInstance
        .put<Lead>(ENDPOINTS.leads.updateStatus(id), {
          status,
          ...(note ? { note } : {}),
        })
        .then((r) => r.data),
  },
}
