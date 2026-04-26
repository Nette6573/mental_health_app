"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  UserCheck,
  TrendingUp,
  Activity,
  Shield,
  ArrowRight,
  ArrowUpRight,
  Eye,
  UserX,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { useAdmin, UserDetails } from "@/hooks/use-admin"
import { UserProfile } from "@/hooks/use-user"

export default function AdminDashboard() {
  const { isAdmin, isLoading, isAuthenticated, users, stats, updateUser, getUserDetails } = useAdmin()
  const { toast } = useToast()
  const router = useRouter()

  const handleSignOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }, [router])
  
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null)
  const [isViewingUser, setIsViewingUser] = useState(false)
  const [isUpdatingUser, setIsUpdatingUser] = useState(false)
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)

  // Redirect if not authenticated or not admin
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        redirect("/auth/login")
      } else if (!isAdmin) {
        redirect("/dashboard")
      }
    }
  }, [isLoading, isAuthenticated, isAdmin])

  const handleViewUser = async (userId: string) => {
    setLoadingUserId(userId)
    try {
      const details = await getUserDetails(userId)
      setSelectedUser(details)
      setIsViewingUser(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user details.",
        variant: "destructive",
      })
    } finally {
      setLoadingUserId(null)
    }
  }

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setIsUpdatingUser(true)
    try {
      await updateUser(userId, { role: newRole })
      toast({
        title: "Role updated",
        description: `User role changed to ${newRole}.`,
      })
      if (selectedUser && selectedUser.user.id === userId) {
        setSelectedUser({
          ...selectedUser,
          user: { ...selectedUser.user, role: newRole as UserProfile["role"] },
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingUser(false)
    }
  }

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    setIsUpdatingUser(true)
    try {
      await updateUser(userId, { is_active: !currentStatus })
      toast({
        title: currentStatus ? "Account deactivated" : "Account activated",
        description: currentStatus 
          ? "User account has been deactivated." 
          : "User account has been activated.",
      })
      if (selectedUser && selectedUser.user.id === userId) {
        setSelectedUser({
          ...selectedUser,
          user: { ...selectedUser.user, is_active: !currentStatus },
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingUser(false)
    }
  }

  if (isLoading || !isAdmin) {
    return (
      <DashboardLayout
        role="admin"
        user={{ name: "Loading...", email: "", avatar: "" }}
        title="Admin Dashboard"
        description="Loading..."
        onSignOut={handleSignOut}
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </DashboardLayout>
    )
  }

  // Calculate high-risk users (users who logged "struggling" mood recently)
  const highRiskCount = 0 // Would need mood data aggregation

  const platformStats = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      label: "Active Providers",
      value: stats.providers?.toLocaleString() || "0",
      change: "+8%",
      trend: "up",
      icon: UserCheck,
    },
    {
      label: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      change: "+15%",
      trend: "up",
      icon: Activity,
    },
    {
      label: "Admins",
      value: stats.admins.toLocaleString(),
      change: "0%",
      trend: "neutral",
      icon: Shield,
    },
  ]

  // Get recent users (last 10)
  const recentUsers = users.slice(0, 10)

  return (
    <DashboardLayout
      role="admin"
      user={{ name: "Admin", email: "admin@hopepath.jm", avatar: "" }}
      title="Admin Dashboard"
      description="Platform overview and management"
      onSignOut={handleSignOut}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        {platformStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  {stat.trend !== "neutral" && (
                    <div className="flex items-center gap-1 text-sm text-primary">
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      {stat.change}
                    </div>
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground mt-4">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          )
        })}

        {/* User Management */}
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
              User Management
            </CardTitle>
            <Badge variant="secondary">{stats.totalUsers} users</Badge>
          </CardHeader>
          <CardContent>
            {recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar_url || ""} alt="" />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {user.first_name && user.last_name
                          ? `${user.first_name[0]}${user.last_name[0]}`
                          : user.email?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : "No name set"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={
                          user.role === "admin" 
                            ? "default" 
                            : user.role === "provider" 
                              ? "secondary" 
                              : "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                      {!user.is_active && (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewUser(user.id)}
                      disabled={loadingUserId === user.id}
                    >
                      {loadingUserId === user.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Users className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No users found</p>
              </div>
            )}
            <Button variant="ghost" className="w-full mt-4 gap-2" asChild>
              <Link href="/admin/users">
                View all users
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Management Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/admin/users">
                  <Users className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">User Management</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/admin/therapists">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">Therapist Management</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/admin/analytics">
                  <TrendingUp className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">Platform Analytics</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
                <Link href="/admin/reports">
                  <Activity className="h-5 w-5" aria-hidden="true" />
                  <span className="text-sm">Reports Center</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Details Dialog */}
      <Dialog open={isViewingUser} onOpenChange={setIsViewingUser}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedUser.user.avatar_url || ""} alt="" />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedUser.user.first_name && selectedUser.user.last_name
                      ? `${selectedUser.user.first_name[0]}${selectedUser.user.last_name[0]}`
                      : selectedUser.user.email?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">
                    {selectedUser.user.first_name && selectedUser.user.last_name
                      ? `${selectedUser.user.first_name} ${selectedUser.user.last_name}`
                      : "No name set"}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedUser.user.email}</p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant={selectedUser.user.role === "admin" ? "default" : "secondary"}>
                      {selectedUser.user.role}
                    </Badge>
                    <Badge variant={selectedUser.user.is_active ? "outline" : "destructive"}>
                      {selectedUser.user.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/50 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {selectedUser.moodEntries.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Mood Logs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {selectedUser.sessions.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Sessions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">
                    {selectedUser.journalEntries.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Journal Entries</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Change Role</label>
                  <Select
                    value={selectedUser.user.role}
                    onValueChange={(value) => handleUpdateRole(selectedUser.user.id, value)}
                    disabled={isUpdatingUser}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="provider">Provider</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Account Status</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedUser.user.is_active ? "Account is active" : "Account is deactivated"}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={selectedUser.user.is_active ? "destructive" : "default"}
                    onClick={() => handleToggleActive(selectedUser.user.id, selectedUser.user.is_active)}
                    disabled={isUpdatingUser}
                  >
                    {isUpdatingUser ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : selectedUser.user.is_active ? (
                      <>
                        <UserX className="h-4 w-4 mr-1" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-1" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewingUser(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
