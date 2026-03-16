"use client"

import { AlertCircleIcon, RefreshCwIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function InsuranceError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircleIcon className="size-6 text-destructive" />
        </div>
        <div>
          <p className="text-base font-semibold">Something went wrong</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {error.message ?? "Failed to load insurance data"}
          </p>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={reset} className="gap-2">
        <RefreshCwIcon className="size-3.5" />
        Try again
      </Button>
    </div>
  )
}
