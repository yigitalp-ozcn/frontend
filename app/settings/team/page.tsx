"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MoreVertical, CircleCheck, Clock, Crown, Shield, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type TeamMember = {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "viewer"
  avatar?: string
  status: "active" | "pending"
}

const initialTeamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Yiğitalp Özcan",
    email: "yigitalp@example.com",
    role: "owner",
    status: "active",
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "viewer",
    status: "pending",
  },
]

export default function TeamSettingsPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<"owner" | "admin" | "viewer">("viewer")

  const handleInvite = () => {
    // Handle invite logic here
    console.log("Inviting:", inviteEmail, inviteRole)
    setIsInviteDialogOpen(false)
    setInviteEmail("")
    setInviteRole("viewer")
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription className="mt-2">
                Manage your team members and their roles.
              </CardDescription>
            </div>
            <Button onClick={() => setIsInviteDialogOpen(true)}>
              Add Member
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>
                          {member.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        member.role === "owner" 
                          ? "border-red-500/50 text-red-700 dark:text-red-400" 
                          : member.role === "admin"
                          ? "border-blue-500/50 text-blue-700 dark:text-blue-400"
                          : "border-muted-foreground/50 text-muted-foreground"
                      }
                    >
                      {member.role === "owner" ? (
                        <Crown className="mr-1 h-3 w-3" />
                      ) : member.role === "admin" ? (
                        <Shield className="mr-1 h-3 w-3" />
                      ) : (
                        <Eye className="mr-1 h-3 w-3" />
                      )}
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        member.status === "active"
                          ? "border-green-500/50 text-green-700 dark:text-green-400"
                          : "border-amber-500/50 text-amber-700 dark:text-amber-400"
                      }
                    >
                      {member.status === "active" ? (
                        <CircleCheck className="mr-1 h-3 w-3" />
                      ) : (
                        <Clock className="mr-1 h-3 w-3" />
                      )}
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem>Resend Invitation</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remove Member
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your team.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>Role</Label>
              <RadioGroup value={inviteRole} onValueChange={(value: "owner" | "admin" | "viewer") => setInviteRole(value)}>
                <div className="flex items-center gap-3 rounded-md border p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Crown className="h-5 w-5 text-red-700 dark:text-red-400 flex-shrink-0" />
                    <div className="space-y-1 leading-none flex-1">
                      <Label htmlFor="owner" className="font-medium cursor-pointer">
                        Owner
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Full access with complete control over the organization.
                      </p>
                    </div>
                  </div>
                  <RadioGroupItem value="owner" id="owner" className="flex-shrink-0" />
                </div>
                <div className="flex items-center gap-3 rounded-md border p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Shield className="h-5 w-5 text-blue-700 dark:text-blue-400 flex-shrink-0" />
                    <div className="space-y-1 leading-none flex-1">
                      <Label htmlFor="admin" className="font-medium cursor-pointer">
                        Admin
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Can manage team members, settings, and all resources.
                      </p>
                    </div>
                  </div>
                  <RadioGroupItem value="admin" id="admin" className="flex-shrink-0" />
                </div>
                <div className="flex items-center gap-3 rounded-md border p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <Eye className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <div className="space-y-1 leading-none flex-1">
                      <Label htmlFor="viewer" className="font-medium cursor-pointer">
                        Viewer
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Read-only access to view data and reports.
                      </p>
                    </div>
                  </div>
                  <RadioGroupItem value="viewer" id="viewer" className="flex-shrink-0" />
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleInvite} disabled={!inviteEmail}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

