"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  Calendar,
  MessageSquare,
  BookOpen,
  BarChart3,
  Users,
  Settings,
  LogOut,
  User,
  Shield,
  FileText,
  Bell,
  Heart,
  Activity,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/theme-toggle"

type UserRole = "user" | "provider" | "admin"

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  roles: UserRole[]
}

const navItems: NavItem[] = [
  // User Navigation
  { label: "Dashboard", href: "/dashboard", icon: Home, roles: ["user"] },
  { label: "Chat (Paula)", href: "/chat", icon: Sparkles, roles: ["user"] },
  { label: "Resources", href: "/resources", icon: BookOpen, roles: ["user"] },
  { label: "Sessions", href: "/dashboard/sessions", icon: Calendar, roles: ["user"] },
  { label: "Messages", href: "/dashboard/messages", icon: MessageSquare, roles: ["user"] },
  { label: "Journal", href: "/dashboard/journal", icon: BookOpen, roles: ["user"] },
  { label: "Mood Tracker", href: "/dashboard/mood", icon: Activity, roles: ["user"] },
  { label: "Self-Care", href: "/dashboard/self-care", icon: Heart, roles: ["user"] },
  { label: "Progress", href: "/dashboard/progress", icon: BarChart3, roles: ["user"] },
  { label: "Settings", href: "/settings", icon: Settings, roles: ["user"] },
  
  // Provider Navigation
  { label: "Provider Dashboard", href: "/provider/dashboard", icon: Home, roles: ["provider"] },
  { label: "Assigned Users", href: "/provider/users", icon: Users, roles: ["provider"] },
  { label: "Messages", href: "/provider/messages", icon: MessageSquare, roles: ["provider"] },
  { label: "Appointments", href: "/provider/appointments", icon: Calendar, roles: ["provider"] },
  { label: "Notes", href: "/provider/notes", icon: FileText, roles: ["provider"] },
  
  // Admin Navigation
  { label: "Admin Dashboard", href: "/admin/dashboard", icon: Home, roles: ["admin"] },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["admin"] },
  { label: "Providers", href: "/admin/providers", icon: Shield, roles: ["admin"] },
  { label: "System Overview", href: "/admin/system", icon: BarChart3, roles: ["admin"] },
  { label: "Invite Codes", href: "/admin/invites", icon: FileText, roles: ["admin"] },
]

interface AppSidebarProps {
  role: UserRole
  user: {
    name: string
    email: string
    avatar?: string
  }
  onSignOut?: () => void
}

export function AppSidebar({ role, user, onSignOut }: AppSidebarProps) {
  const pathname = usePathname()
  const filteredItems = navItems.filter((item) => item.roles.includes(role))

  const roleLabels: Record<UserRole, string> = {
    user: "Member",
    provider: "Provider",
    admin: "Administrator",
  }

  return (
    <aside className="flex flex-col h-full w-64 bg-sidebar border-r border-sidebar-border">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="HopePath"
              width={44}
              height={44}
              className="rounded-lg"
            />
            <div>
              <h1 className="font-semibold text-sidebar-foreground text-lg">
                HopePath
              </h1>
              <p className="text-xs text-muted-foreground">{roleLabels[role]}</p>
            </div>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Main">
        {filteredItems.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-auto p-2 hover:bg-sidebar-accent"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.avatar} alt="" />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" aria-hidden="true" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" aria-hidden="true" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive cursor-pointer"
              onClick={onSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
