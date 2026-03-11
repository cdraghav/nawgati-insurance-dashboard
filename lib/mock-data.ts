export type InsuranceRecord = {
  id: string
  timestamp: string
  vehicleNumber: string
  isCommercial: boolean
  area: string
  insuranceExpiry: string
  phoneNumber: string
}

export const insuranceRecords: InsuranceRecord[] = [
  {
    id: "rec-001",
    timestamp: "2026-03-11 08:14:22",
    vehicleNumber: "DL-1C-XX-XXXX",
    isCommercial: false,
    area: "Chanakyapuri",
    insuranceExpiry: "2026-02-15",
    phoneNumber: "98XXXX1234",
  },
  {
    id: "rec-002",
    timestamp: "2026-03-11 08:31:05",
    vehicleNumber: "DL-3C-XX-XXXX",
    isCommercial: true,
    area: "Connaught Place",
    insuranceExpiry: "2026-03-01",
    phoneNumber: "70XXXX5678",
  },
  {
    id: "rec-003",
    timestamp: "2026-03-11 08:47:39",
    vehicleNumber: "DL-9C-XX-XXXX",
    isCommercial: false,
    area: "Rohini Sector 11",
    insuranceExpiry: "2026-03-10",
    phoneNumber: "91XXXX9012",
  },
  {
    id: "rec-004",
    timestamp: "2026-03-11 09:02:11",
    vehicleNumber: "DL-12-XX-XXXX",
    isCommercial: false,
    area: "Hauz Khas Village",
    insuranceExpiry: "2026-03-12",
    phoneNumber: "88XXXX3456",
  },
  {
    id: "rec-005",
    timestamp: "2026-03-11 09:18:54",
    vehicleNumber: "DL-8C-XX-XXXX",
    isCommercial: true,
    area: "Lajpat Nagar",
    insuranceExpiry: "2026-03-15",
    phoneNumber: "99XXXX7890",
  },
  {
    id: "rec-006",
    timestamp: "2026-03-11 09:34:17",
    vehicleNumber: "DL-4C-XX-XXXX",
    isCommercial: false,
    area: "Karol Bagh Market",
    insuranceExpiry: "2026-03-25",
    phoneNumber: "77XXXX2345",
  },
  {
    id: "rec-007",
    timestamp: "2026-03-11 09:51:42",
    vehicleNumber: "DL-2C-XX-XXXX",
    isCommercial: false,
    area: "Tilak Nagar",
    insuranceExpiry: "2026-04-05",
    phoneNumber: "82XXXX6789",
  },
  {
    id: "rec-008",
    timestamp: "2026-03-11 10:05:28",
    vehicleNumber: "DL-10-XX-XXXX",
    isCommercial: false,
    area: "Vasant Kunj",
    insuranceExpiry: "2026-02-28",
    phoneNumber: "93XXXX1234",
  },
  {
    id: "rec-009",
    timestamp: "2026-03-11 10:22:03",
    vehicleNumber: "DL-7C-XX-XXXX",
    isCommercial: false,
    area: "Mayur Vihar Phase 1",
    insuranceExpiry: "2026-03-11",
    phoneNumber: "80XXXX5678",
  },
  {
    id: "rec-010",
    timestamp: "2026-03-11 10:39:56",
    vehicleNumber: "DL-5C-XX-XXXX",
    isCommercial: false,
    area: "Shahdara",
    insuranceExpiry: "2026-04-01",
    phoneNumber: "96XXXX9012",
  },
  {
    id: "rec-011",
    timestamp: "2026-03-11 10:58:14",
    vehicleNumber: "DL-1Y-XX-XXXX",
    isCommercial: true,
    area: "Dwarka Sector 21",
    insuranceExpiry: "2026-03-13",
    phoneNumber: "74XXXX3456",
  },
  {
    id: "rec-012",
    timestamp: "2026-03-11 11:13:47",
    vehicleNumber: "DL-11-XX-XXXX",
    isCommercial: false,
    area: "Janakpuri",
    insuranceExpiry: "2026-03-08",
    phoneNumber: "85XXXX7890",
  },
  {
    id: "rec-013",
    timestamp: "2026-03-11 11:29:09",
    vehicleNumber: "DL-3S-XX-XXXX",
    isCommercial: false,
    area: "Paharganj",
    insuranceExpiry: "2026-04-09",
    phoneNumber: "92XXXX2345",
  },
  {
    id: "rec-014",
    timestamp: "2026-03-11 11:46:33",
    vehicleNumber: "DL-6C-XX-XXXX",
    isCommercial: false,
    area: "Pitampura",
    insuranceExpiry: "2026-03-20",
    phoneNumber: "78XXXX6789",
  },
  {
    id: "rec-015",
    timestamp: "2026-03-11 12:02:58",
    vehicleNumber: "DL-1C-XX-XXXX",
    isCommercial: false,
    area: "Civil Lines",
    insuranceExpiry: "2026-01-30",
    phoneNumber: "89XXXX1234",
  },
  {
    id: "rec-016",
    timestamp: "2026-03-11 12:18:21",
    vehicleNumber: "DL-8S-XX-XXXX",
    isCommercial: false,
    area: "Greater Kailash 2",
    insuranceExpiry: "2026-03-22",
    phoneNumber: "97XXXX5678",
  },
  {
    id: "rec-017",
    timestamp: "2026-03-11 12:34:44",
    vehicleNumber: "DL-4C-XX-XXXX",
    isCommercial: true,
    area: "Saket District Centre",
    insuranceExpiry: "2026-03-30",
    phoneNumber: "75XXXX9012",
  },
  {
    id: "rec-018",
    timestamp: "2026-03-11 12:51:02",
    vehicleNumber: "DL-12-XX-XXXX",
    isCommercial: false,
    area: "R K Puram",
    insuranceExpiry: "2026-03-11",
    phoneNumber: "83XXXX3456",
  },
  {
    id: "rec-019",
    timestamp: "2026-03-11 13:07:29",
    vehicleNumber: "DL-10-XX-XXXX",
    isCommercial: false,
    area: "Aerocity",
    insuranceExpiry: "2026-02-14",
    phoneNumber: "90XXXX7890",
  },
  {
    id: "rec-020",
    timestamp: "2026-03-11 13:24:55",
    vehicleNumber: "DL-3C-XX-XXXX",
    isCommercial: false,
    area: "Okhla Phase III",
    insuranceExpiry: "2026-04-02",
    phoneNumber: "76XXXX2345",
  },
  {
    id: "rec-021",
    timestamp: "2026-03-11 13:41:08",
    vehicleNumber: "DL-1L-XX-XXXX",
    isCommercial: true,
    area: "Chandni Chowk",
    insuranceExpiry: "2026-01-01",
    phoneNumber: "84XXXX6789",
  },
  {
    id: "rec-022",
    timestamp: "2026-03-11 13:57:33",
    vehicleNumber: "DL-1T-XX-XXXX",
    isCommercial: true,
    area: "Naraina Industrial",
    insuranceExpiry: "2026-03-14",
    phoneNumber: "91XXXX1234",
  },
  {
    id: "rec-023",
    timestamp: "2026-03-11 14:12:49",
    vehicleNumber: "DL-1V-XX-XXXX",
    isCommercial: true,
    area: "Preet Vihar",
    insuranceExpiry: "2026-03-28",
    phoneNumber: "79XXXX5678",
  },
  {
    id: "rec-024",
    timestamp: "2026-03-11 14:28:17",
    vehicleNumber: "DL-9C-XX-XXXX",
    isCommercial: false,
    area: "Paschim Vihar",
    insuranceExpiry: "2026-02-20",
    phoneNumber: "95XXXX9012",
  },
  {
    id: "rec-025",
    timestamp: "2026-03-11 14:43:52",
    vehicleNumber: "DL-1C-XX-XXXX",
    isCommercial: true,
    area: "NDLS",
    insuranceExpiry: "2026-03-18",
    phoneNumber: "72XXXX3456",
  },
]

export function getExpiryStatus(expiry: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expiryDate = new Date(expiry)
  const diffDays = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  if (diffDays < 0)
    return {
      label: "Expired",
      variant: "destructive" as const,
      status: "expired" as const,
    }
  if (diffDays <= 30)
    return {
      label: `Exp. in ${diffDays}d`,
      variant: "secondary" as const,
      warn: true,
      status: "expiring" as const,
    }
  return {
    label: "Valid",
    variant: "outline" as const,
    status: "valid" as const,
  }
}
