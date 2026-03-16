"use client"

import { usePathname } from "next/navigation"
import { BellIcon, LogOutIcon, SunIcon, MoonIcon, MonitorIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/use-auth"

const PAGE_TITLES: Record<string, string> = {
  "/insurance": "Insurance",
}

export function AppHeader() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { setTheme, theme } = useTheme()

  const title = PAGE_TITLES[pathname] ?? "Dashboard"
  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : "AU"

  return (
    <header className="bg-sidebar sticky top-0 z-50 flex h-[55px] items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <SidebarTrigger className="[&_svg]:!size-5" />

        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold">{title}</h1>
          <div className="flex items-center gap-1.5 rounded-full border border-success-2 bg-success-0 px-2 py-0.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success-3" />
            <span className="text-xs font-medium text-success-3">
              Live
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="relative flex items-center justify-center rounded-md h-9 w-9"
          aria-label="Notifications"
        >
          <BellIcon className="size-5" />
        </Button>

        <span className="text-muted-foreground/50 text-sm font-light">|</span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium leading-none">{user ? `${user.first_name} ${user.last_name}` : ""}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user?.email}
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal pb-1">
              Appearance
            </DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
              <SunIcon className="size-4" />
              Light
              {theme === "light" && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
              <MoonIcon className="size-4" />
              Dark
              {theme === "dark" && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTheme("system")}
              className="gap-2"
            >
              <MonitorIcon className="size-4" />
              System
              {theme === "system" && (
                <span className="ml-auto text-xs text-primary">✓</span>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <LogOutIcon className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
