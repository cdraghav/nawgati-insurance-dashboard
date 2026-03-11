import * as React from "react"
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { NgtNumber } from "@/components/ui/primitives"

type StatCardVariant = "default" | "success" | "warning" | "danger"

type StatCardProps = {
  title: string
  value: number | string
  subheading: string
  icon: React.ElementType
  changePercent: number
  changeLabel?: string
  variant?: StatCardVariant
  isLoading?: boolean
}

const variantStyles: Record<
  StatCardVariant,
  { icon: string; positive: string; negative: string }
> = {
  default: {
    icon: "bg-primary/10 text-primary",
    positive: "text-success-4",
    negative: "text-error-3",
  },
  success: {
    icon: "bg-success-0 text-success-4",
    positive: "text-success-4",
    negative: "text-error-3",
  },
  warning: {
    icon: "bg-warning-0 text-warning-3",
    positive: "text-warning-3",
    negative: "text-warning-3",
  },
  danger: {
    icon: "bg-error-0 text-error-3",
    positive: "text-success-4",
    negative: "text-error-3",
  },
}

export function StatCard({
  title,
  value,
  subheading,
  icon: Icon,
  changePercent,
  variant = "default",
  isLoading = false,
}: StatCardProps) {
  const styles = variantStyles[variant]

  const isPositive = changePercent > 0
  const isNeutral = changePercent === 0
  const TrendIcon = isNeutral
    ? MinusIcon
    : isPositive
      ? TrendingUpIcon
      : TrendingDownIcon

  const trendColor = isNeutral
    ? "text-muted-foreground"
    : isPositive
      ? styles.positive
      : styles.negative

  return (
    <Card data-slot="stat-card">
      <CardContent className="flex flex-col gap-3 p-3">
        <div className="flex items-start justify-between">
          <div className={cn("flex items-center justify-center rounded-lg p-2", styles.icon)}>
            <Icon className="size-5" />
          </div>
          {isLoading ? (
            <div className="h-4 w-12 animate-pulse rounded bg-muted" />
          ) : (
            <div className="flex items-center gap-1">
              <TrendIcon className={cn("size-3.5", trendColor)} />
              <span className={cn("text-xs font-medium", trendColor)}>
                {isPositive ? "+" : ""}
                {changePercent.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div>
          {isLoading ? (
            <div className="h-7 w-16 animate-pulse rounded bg-muted" />
          ) : (
            <NgtNumber value={value} size="xl" />
          )}
          <p className="mt-0.5 text-xs text-muted-foreground">{subheading}</p>
        </div>
        <p className="text-sm font-medium">{title}</p>
      </CardContent>
    </Card>
  )
}
