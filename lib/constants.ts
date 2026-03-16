export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"

export const ENDPOINTS = {
  auth: {
    signin: "/users/signin",
    signout: "/users/signout",
    refresh: "/refresh",
    signup: "/users/signup",
  },
  users: {
    get: (id: number) => `/users/${id}`,
    update: (id: number) => `/users/${id}`,
    agents: "/users/agents",
  },
  visits: {
    list: "/visits",
    get: (id: string) => `/visits/${id}`,
  },
  leads: {
    reveal: "/leads/reveal",
    list: "/leads",
    get: (id: number) => `/leads/${id}`,
    updateStatus: (id: number) => `/leads/${id}/status`,
    partnerCallback: "/leads/partner-callback",
  },
} as const
