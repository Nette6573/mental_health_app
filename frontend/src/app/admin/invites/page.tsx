"use client"

import { useState, useEffect, useCallback } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/LandingCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Plus, Copy, Check, Clock, UserCheck, XCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface Invite {
  id: string
  code: string
  role: "admin" | "provider"
  created_at: string
  expires_at: string
  is_active: boolean
  used_at: string | null
  creator?: { first_name: string; last_name: string }
  used_by_profile?: { first_name: string; last_name: string }
}

export default function AdminInvitesPage() {
  const [invites, setInvites] = useState<Invite[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newRole, setNewRole] = useState<"admin" | "provider">("provider")
  const [expiresInDays, setExpiresInDays] = useState("7")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const { toast } = useToast()

  // Define fetchInvites BEFORE useEffect
  const fetchInvites = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/invites")
      const data = await res.json()
      if (data.invites) {
        setInvites(data.invites)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch invite codes",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchInvites()
  }, [fetchInvites])

  const createInvite = async () => {
    setCreating(true)
    try {
      const res = await fetch("/api/admin/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole, expiresInDays: parseInt(expiresInDays) }),
      })
      const data = await res.json()
      if (data.invite) {
        setInvites([data.invite, ...invites])
        setDialogOpen(false)
        toast({
          title: "Invite Created",
          description: `New ${newRole} invite code generated successfully.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invite code",
        variant: "destructive",
      })
    } finally {
      setCreating(false)
    }
  }

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedId(id)
    toast({ title: "Copied!", description: "Invite code copied to clipboard" })
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (invite: Invite) => {
    if (invite.used_at) {
      return <Badge variant="secondary"><UserCheck className="h-3 w-3 mr-1" />Used</Badge>
    }
    if (new Date(invite.expires_at) < new Date()) {
      return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>
    }
    if (!invite.is_active) {
      return <Badge variant="outline"><XCircle className="h-3 w-3 mr-1" />Inactive</Badge>
    }
    return <Badge className="bg-primary"><Clock className="h-3 w-3 mr-1" />Active</Badge>
  }

  return (
    <DashboardLayout
      role="admin"
      user={{ name: "Admin", email: "admin@hopepath.jm", avatar: "" }}
      title="Invite Codes"
      description="Manage admin and provider invite codes"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{invites.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Invites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">
                {invites.filter(i => i.is_active && !i.used_at && new Date(i.expires_at) > new Date()).length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Used Invites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-accent">
                {invites.filter(i => i.used_at).length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invite Codes Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Invite Codes</CardTitle>
              <CardDescription>
                Generate and manage invite codes for new admins and providers
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Invite Code</DialogTitle>
                  <DialogDescription>
                    Generate a secure invite code for a new admin or provider.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newRole} onValueChange={(v: string) => setNewRole(v as "admin" | "provider")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="provider">Provider</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires In (Days)</Label>
                    <Input
                      id="expires"
                      type="number"
                      min="1"
                      max="30"
                      value={expiresInDays}
                      onChange={(e) => setExpiresInDays(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createInvite} disabled={creating}>
                    {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : invites.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No invite codes yet. Create your first one!
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((invite) => (
                    <TableRow key={invite.id}>
                      <TableCell className="font-mono text-sm">
                        {invite.code}
                      </TableCell>
                      <TableCell>
                        <Badge variant={invite.role === "admin" ? "destructive" : "default"}>
                          {invite.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(invite)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(invite.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(invite.expires_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {invite.used_by_profile ? (
                          <span className="text-sm">
                            {invite.used_by_profile.first_name} {invite.used_by_profile.last_name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(invite.code, invite.id)}
                          disabled={!!invite.used_at}
                        >
                          {copiedId === invite.id ? (
                            <Check className="h-4 w-4 text-primary" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}