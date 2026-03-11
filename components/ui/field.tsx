import * as React from "react"
import { cn } from "@/lib/utils"

export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />
}

export function FieldLabel({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    />
  )
}

export function FieldError({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-destructive", className)} {...props}>
      {children}
    </p>
  )
}
