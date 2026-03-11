"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { toast } from "sonner"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NgtButton } from "@/components/ui/primitives"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuthStore } from "@/lib/auth-store"
import { loginSchema } from "@/lib/schemas"

type LoginFormProps = { onValidationError?: (has: boolean) => void }

export function LoginForm({ onValidationError }: LoginFormProps) {
  const router = useRouter()
  const login = useAuthStore((s) => s.login)

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [rememberMe, setRememberMe] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errors, setErrors] = React.useState<{
    email?: string
    password?: string
    form?: string
  }>({})

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {}
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as "email" | "password"
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      onValidationError?.(true)
      return
    }
    onValidationError?.(false)

    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 800))

    const success = login(email, password)
    if (success) {
      toast.success("Welcome back, Admin!")
      router.push("/insurance")
    } else {
      setErrors({ form: "Invalid email or password" })
      setIsLoading(false)
    }
  }

  return (
    <Card className="relative z-10 w-full shadow-md">
      <CardContent className="flex w-full flex-col gap-6 pt-6">
        <div className="flex flex-col items-center gap-2">
          <Logo className="h-6 w-auto" />
          <div className="text-center">
            <p className="text-xl font-semibold">Sign in to your account</p>
            <p className="text-sm text-muted-foreground">
              Insurance monitoring dashboard
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {errors.form && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errors.form}
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="admin@nawgati.com"
              value={email}
              onChange={(e) => {
                const val = e.target.value
                setEmail(val)
                const valid = loginSchema.shape.email.safeParse(val).success
                onValidationError?.(!valid && val.length > 0)
              }}
              aria-invalid={!!errors.email}
              disabled={isLoading}
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  const emailValid =
                    loginSchema.shape.email.safeParse(email).success
                  onValidationError?.(!emailValid && email.length > 0)
                }}
                aria-invalid={!!errors.password}
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute inset-y-0 right-0 h-full rounded-l-none text-muted-foreground hover:bg-transparent focus-visible:ring-0"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon className="size-4" />
                ) : (
                  <EyeIcon className="size-4" />
                )}
              </Button>
            </div>
            {errors.password && <FieldError>{errors.password}</FieldError>}
          </Field>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(!!v)}
              />
              <label
                htmlFor="rememberMe"
                className="cursor-pointer select-none text-sm text-muted-foreground"
              >
                Remember me
              </label>
            </div>
            <button
              type="button"
              className="text-sm hover:underline"
              onClick={() => toast.info("Password reset coming soon")}
            >
              Forgot password?
            </button>
          </div>

          <NgtButton type="submit" className="w-full" loading={isLoading}>
            Sign in
          </NgtButton>
        </form>
      </CardContent>
    </Card>
  )
}
