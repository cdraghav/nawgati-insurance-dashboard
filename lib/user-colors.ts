const USER_COLORS = [
  { bg: "#DBEAFE", text: "#1D4ED8" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FFE4E6", text: "#9F1239" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#CFFAFE", text: "#155E75" },
  { bg: "#FCE7F3", text: "#831843" },
  { bg: "#E0E7FF", text: "#3730A3" },
]

function hashName(name: string): number {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return hash
}

export function getUserColor(name: string) {
  return USER_COLORS[hashName(name) % USER_COLORS.length]
}

const VEHICLE_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  car: { bg: "#DBEAFE", text: "#1D4ED8" },
  "2w": { bg: "#D1FAE5", text: "#065F46" },
  "3w": { bg: "#FEF3C7", text: "#92400E" },
  hmv: { bg: "#EDE9FE", text: "#5B21B6" },
  lcv: { bg: "#FFE4E6", text: "#9F1239" },
  bus: { bg: "#CFFAFE", text: "#155E75" },
  truck: { bg: "#FCE7F3", text: "#831843" },
  suv: { bg: "#E0E7FF", text: "#3730A3" },
  mpv: { bg: "#FEF9C3", text: "#854D0E" },
}

export function getVehicleTypeColor(type: string) {
  return (
    VEHICLE_TYPE_COLORS[type.toLowerCase()] ??
    USER_COLORS[hashName(type) % USER_COLORS.length]
  )
}

export function getVehicleTypeIconName(
  type: string
): "car" | "truck" | "bike" | "bus" | "auto" | null {
  const map: Record<string, "car" | "truck" | "bike" | "bus" | "auto"> = {
    car: "car",
    suv: "car",
    mpv: "car",
    "2w": "bike",
    "3w": "bike",
    hmv: "truck",
    lcv: "truck",
    truck: "truck",
    bus: "bus",
    bike: "bike",
    auto: "auto",
  }
  return map[type.toLowerCase()] ?? null
}
