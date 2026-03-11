import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/* ============================================================
   NgtText — typography primitive
   Variants: heading | subheading | body | muted | label | caption | mono
   ============================================================ */

const ngtTextVariants = cva("", {
  variants: {
    variant: {
      heading: "text-xl font-bold tracking-tight text-foreground",
      subheading: "text-base font-semibold text-foreground",
      body: "text-sm font-medium text-foreground",
      muted: "text-sm font-medium text-muted-foreground",
      label: "text-xs font-semibold uppercase tracking-wider text-foreground",
      caption: "text-xs font-medium text-muted-foreground",
      mono: "text-xs font-mono text-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

type NgtTextProps = React.HTMLAttributes<HTMLElement> &
  VariantProps<typeof ngtTextVariants> & {
    as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "div" | "label"
  }

function NgtText({ variant, className, as: Tag = "p", ...props }: NgtTextProps) {
  return (
    <Tag
      data-slot="ngt-text"
      data-variant={variant}
      className={cn(ngtTextVariants({ variant }), className)}
      {...(props as React.HTMLAttributes<HTMLElement>)}
    />
  )
}

/* ============================================================
   NgtButton — button primitive with loading state
   Inherits all variants/sizes from button.tsx
   Extra prop: loading — shows spinner, disables interaction
   ============================================================ */

type NgtButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

function NgtButton({
  loading,
  disabled,
  children,
  className,
  variant,
  size,
  asChild = false,
  ...props
}: NgtButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="ngt-button"
      data-loading={loading || undefined}
      className={cn(buttonVariants({ variant, size }), "relative", className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2Icon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      )}
      <span className={cn("contents", loading && "invisible")}>{children}</span>
    </Comp>
  )
}

/* ============================================================
   NgtNumber — numeric display in Geist Sans, tabular figures
   Variants: xs | sm | md | lg | xl | 2xl (default)
   Use for all numeric values: stats, counts, chart totals
   ============================================================ */

const ngtNumberVariants = cva("font-sans font-bold tabular-nums tracking-tight", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-xl",
      xl: "text-2xl",
      "2xl": "text-3xl",
    },
  },
  defaultVariants: {
    size: "2xl",
  },
})

type NgtNumberProps = React.ComponentProps<"span"> &
  VariantProps<typeof ngtNumberVariants> & {
    value: number | string
  }

function NgtNumber({ value, size, className, ...props }: NgtNumberProps) {
  return (
    <span
      data-slot="ngt-number"
      className={cn(ngtNumberVariants({ size }), className)}
      {...props}
    >
      {value}
    </span>
  )
}

export { NgtText, ngtTextVariants, NgtButton, ngtNumberVariants, NgtNumber }
