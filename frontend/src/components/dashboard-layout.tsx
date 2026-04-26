"use client"

import { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { CrisisButton } from "@/components/crisis-button"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"

type UserRole = "user" | "provider" | "admin"

interface DashboardLayoutProps {
  children: ReactNode
  role: UserRole
  user: {
    name: string
    email: string
    avatar?: string
  }
  title: string
  description?: string
  onSignOut?: () => void
}

export function DashboardLayout({
  children,
  role,
  user,
  title,
  description,
  onSignOut,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <AppSidebar role={role} user={user} onSignOut={onSignOut} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-40"
            aria-label="Open navigation menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <AppSidebar role={role} user={user} onSignOut={onSignOut} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">
          <header className="mb-8 lg:pl-0 pl-12">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground text-balance">
              {title}
            </h1>
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </header>
          {children}
        </div>
      </main>

      {/* Crisis Help Button - Always Visible */}
      {role === "user" && <CrisisButton />}
    </div>
  )
}
