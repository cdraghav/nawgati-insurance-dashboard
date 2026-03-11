import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppHeader } from "@/components/layout/app-header"
import { AuthGuard } from "@/components/layout/auth-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex min-h-svh min-w-0 flex-1 flex-col overflow-x-hidden">
          <AppHeader />
          <main className="flex-1 overflow-x-auto p-4 sm:p-6">{children}</main>
        </div>
      </SidebarProvider>
    </AuthGuard>
  )
}
