export interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  role: string
  phone: string
  picture_url: string
  is_super_user?: boolean
  created_at?: string
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface Visit {
  id: string
  timestamp: string
  vehicleNumber: string
  vehicleType: string
  isCommercial: boolean
  area: string
  insuranceExpiry: string | null
  phoneNumber: string | null
  isAssigned: boolean
  isAssignedToMe: boolean
  isClaimable: boolean
  assignedTo: { firstName: string; lastName: string } | null
}

export interface VisitsResponse {
  visits: Visit[]
  page: number
  limit: number
}

export type LeadStatus = "assigned" | "contacted" | "converted" | "lost"

export interface Lead {
  id: number
  visitId: string
  vehicleNumber: string
  vehiclePhone: string | null
  status: LeadStatus
  assignedTo: {
    firstName: string
    lastName: string
  }
  visit?: Visit
}

export interface LeadsResponse {
  leads: Lead[]
  total: number
  page: number
  limit: number
}

export interface Agent {
  id: number
  firstName: string
  lastName: string
  email: string
  pictureUrl: string | null
}

export interface AgentsResponse {
  agents: Agent[]
}

export interface ApiError {
  type: "error"
  message: string
}
