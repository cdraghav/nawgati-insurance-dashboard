"use client"

import * as React from "react"
import dynamic from "next/dynamic"
import { ScanLineIcon, ClockIcon, ActivityIcon } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { LottiePanel } from "@/components/auth/lottie-panel"
import { AuthBackgroundShape } from "@/components/auth/auth-background-shape"

const Lottie = dynamic(() => import("lottie-react"), { ssr: false })

const FEATURES = [
  { icon: ScanLineIcon, title: "Instant Plate Scan", desc: "Number plate recognition in under a second" },
  { icon: ClockIcon, title: "Real-time Alerts", desc: "Immediate flags for expired or missing insurance" },
  { icon: ActivityIcon, title: "Live Dashboard", desc: "Monitor all scans and compliance across your zone" },
]

export default function LoginPage() {
  const [hasError, setHasError] = React.useState(false)
  const [animationData, setAnimationData] = React.useState<object | null>(null)

  React.useEffect(() => {
    fetch("/assets/car-number-plate.json")
      .then((r) => r.json())
      .then(setAnimationData)
      .catch(() => null)
  }, [])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* ── Left — form panel with background shape ── */}
      <div className="relative flex flex-col items-center justify-center overflow-hidden bg-muted/30 px-4 py-10">
        {/* Background shape */}
        <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-60">
          <AuthBackgroundShape />
        </div>

        {/* Content */}
        <div className="relative z-10 flex w-full max-w-md flex-col items-center">
          <LoginForm onValidationError={setHasError} />
        </div>
      </div>

      {/* ── Right — branding panel ── */}
      <div className="relative hidden flex-col items-center justify-center gap-10 overflow-hidden bg-primary px-12 text-primary-foreground lg:flex">
        {/* Subtle radial glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 30%, #818cf8 0%, transparent 70%)",
          }}
        />

        {/* Lottie */}
        <div className="relative z-10 w-72 drop-shadow-2xl">
          {animationData ? (
            <Lottie animationData={animationData} loop />
          ) : (
            <div className="h-72" />
          )}
        </div>

        {/* Headline */}
        <div className="relative z-10 max-w-sm text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Smart Insurance Monitoring
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/70">
            Scan vehicle number plates and instantly verify insurance status.
            Built for modern traffic enforcement agencies.
          </p>
        </div>

        {/* Feature list */}
        <div className="relative z-10 flex w-full max-w-xs flex-col gap-3.5">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/15">
                <Icon className="size-3.5" />
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{title}</p>
                <p className="text-xs text-white/60">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
