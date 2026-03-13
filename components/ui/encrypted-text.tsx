"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%-!*&?"

type EncryptedTextProps = {
  text: string
  encryptedClassName?: string
  revealedClassName?: string
  revealDelayMs?: number
  className?: string
  onComplete?: () => void
}

export function EncryptedText({
  text,
  encryptedClassName,
  revealedClassName,
  revealDelayMs = 30,
  className,
  onComplete,
}: EncryptedTextProps) {
  const [revealedCount, setRevealedCount] = React.useState(0)
  const onCompleteRef = React.useRef(onComplete)
  onCompleteRef.current = onComplete
  const [scrambled, setScrambled] = React.useState<string[]>(() =>
    Array.from({ length: text.length }, () => randomChar(text, 0, -1))
  )

  // Scramble unrevealed chars at 40ms tick
  React.useEffect(() => {
    if (revealedCount >= text.length) return
    const id = setInterval(() => {
      setScrambled((prev) =>
        prev.map((_, i) =>
          i < revealedCount ? text[i] : randomChar(text, i, revealedCount)
        )
      )
    }, 40)
    return () => clearInterval(id)
  }, [revealedCount, text])

  // Reveal one char at a time; fire onComplete when done
  React.useEffect(() => {
    if (revealedCount >= text.length) {
      onCompleteRef.current?.()
      return
    }
    const id = setTimeout(
      () => setRevealedCount((c) => c + 1),
      revealDelayMs
    )
    return () => clearTimeout(id)
  }, [revealedCount, text.length, revealDelayMs])

  return (
    <span className={className}>
      {Array.from({ length: text.length }, (_, i) => {
        const isRevealed = i < revealedCount
        return (
          <span
            key={i}
            className={cn(isRevealed ? revealedClassName : encryptedClassName)}
          >
            {isRevealed ? text[i] : (scrambled[i] ?? randomChar(text, i, revealedCount))}
          </span>
        )
      })}
    </span>
  )
}

// Keep spaces and hyphens as-is for structural fidelity
function randomChar(text: string, index: number, revealedCount: number): string {
  if (index < revealedCount) return text[index]
  const ch = text[index]
  if (ch === " ") return " "
  if (ch === "-") return CHARS[Math.floor(Math.random() * CHARS.length)]
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}
