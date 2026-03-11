import * as React from "react"
import { Badge } from "@/components/ui/badge"
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
    <Badge
      variant="outline"
      className={cn(
        "h-auto rounded-md px-2 py-0.5 font-mono text-xs font-bold tracking-widest",
        isCommercial
          ? "border-amber-400 bg-amber-100 text-amber-900 dark:border-amber-500 dark:bg-amber-950/20 dark:text-amber-200"
          : "border-accent-foreground/30 bg-accent text-accent-foreground",
        className
      )}
    >
      {children ?? value}
    </Badge>
  )
}
