import * as React from "react"
import { cn } from "@/lib/utils"

type NumberPlateProps = {
  value?: string
  isCommercial?: boolean
  className?: string
  children?: React.ReactNode
}

export function NumberPlate({
  value,
  isCommercial = false,
  className,
  children,
}: NumberPlateProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-sm font-bold tracking-widest leading-none",
        isCommercial
          ? "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-500 dark:bg-amber-950/20 dark:text-amber-200"
          : "border-accent-foreground/30 bg-accent text-accent-foreground",
        className
      )}
    >
      {children ?? value}
    </span>
  )
}

