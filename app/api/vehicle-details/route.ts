import { NextRequest, NextResponse } from "next/server"

// Server-side only — real (unobfuscated) data
const realData: Record<string, { vehicleNumber: string; phoneNumber: string }> =
  {
    "rec-001": { vehicleNumber: "HR-26-AB-4782", phoneNumber: "+91-98654-1234" },
    "rec-002": { vehicleNumber: "DL-3C-CD-9021", phoneNumber: "+91-70213-5678" },
    "rec-003": { vehicleNumber: "HR-51-EF-3367", phoneNumber: "+91-91847-9012" },
    "rec-004": { vehicleNumber: "UP-16-GH-5540", phoneNumber: "+91-88321-3456" },
    "rec-005": { vehicleNumber: "DL-8C-IJ-7893", phoneNumber: "+91-99102-7890" },
    "rec-006": { vehicleNumber: "HR-29-KL-2214", phoneNumber: "+91-77654-2345" },
    "rec-007": { vehicleNumber: "GJ-01-MN-6638", phoneNumber: "+91-82091-6789" },
    "rec-008": { vehicleNumber: "MH-02-OP-1156", phoneNumber: "+91-93478-1234" },
    "rec-009": { vehicleNumber: "UP-14-QR-8873", phoneNumber: "+91-80123-5678" },
    "rec-010": { vehicleNumber: "HR-10-ST-4421", phoneNumber: "+91-96765-9012" },
    "rec-011": { vehicleNumber: "DL-1Y-UV-3309", phoneNumber: "+91-74532-3456" },
    "rec-012": { vehicleNumber: "HR-55-WX-7745", phoneNumber: "+91-85219-7890" },
    "rec-013": { vehicleNumber: "RJ-14-YZ-9912", phoneNumber: "+91-92344-2345" },
    "rec-014": { vehicleNumber: "PB-10-AB-6630", phoneNumber: "+91-78901-6789" },
    "rec-015": { vehicleNumber: "UP-65-CD-2287", phoneNumber: "+91-89567-1234" },
    "rec-016": { vehicleNumber: "HR-20-EF-5543", phoneNumber: "+91-97234-5678" },
    "rec-017": { vehicleNumber: "DL-4C-GH-8871", phoneNumber: "+91-75890-9012" },
    "rec-018": { vehicleNumber: "HR-68-IJ-1124", phoneNumber: "+91-83456-3456" },
    "rec-019": { vehicleNumber: "MH-12-KL-4496", phoneNumber: "+91-90123-7890" },
    "rec-020": { vehicleNumber: "UP-32-MN-7762", phoneNumber: "+91-76789-2345" },
  }

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  // Simulate network latency
  await new Promise((r) => setTimeout(r, 500))

  const details = realData[id]
  if (!details) {
    return NextResponse.json({ error: "Record not found" }, { status: 404 })
  }

  return NextResponse.json(details)
}
