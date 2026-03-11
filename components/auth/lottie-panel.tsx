"use client"

import { ShieldCheckIcon, ShieldAlertIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type LottiePanelProps = {
  hasError?: boolean
}

export function LottiePanel({ hasError = false }: LottiePanelProps) {
  return (
    <div className="mb-2 flex items-center justify-center">
      <div
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300",
          hasError
            ? "bg-destructive/10"
            : "bg-primary/10"
        )}
      >
        {/* Outer ring */}
        <div
          className={cn(
            "absolute inset-0 rounded-full border-2 transition-colors duration-300",
            hasError
              ? "border-destructive/30 animate-ping"
              : "border-primary/20"
          )}
        />
        {hasError ? (
          <ShieldAlertIcon
            className="relative h-9 w-9 text-destructive transition-all duration-300"
            strokeWidth={1.5}
          />
        ) : (
          <ShieldCheckIcon
            className="relative h-9 w-9 text-primary transition-all duration-300"
            strokeWidth={1.5}
          />
        )}
      </div>
    </div>
  )
}
