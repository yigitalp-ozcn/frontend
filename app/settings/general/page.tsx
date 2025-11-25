"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Crown,
  Building2,
  Upload,
  Pencil,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Type definitions
interface UserInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  timeZone: string
}

interface PasswordChange {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordRequirement {
  id: string
  label: string
  test: (password: string) => boolean
}

interface Organization {
  name: string
  logo: string
  plan: "free" | "starter" | "pro" | "enterprise"
  memberCount: number
  userRole: "owner" | "admin" | "member"
  isDefault: boolean
}

export default function GeneralSettingsPage() {
  // User Info State
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: "Alexandra",
    lastName: "Smith",
    email: "alexsmith@content-mobbin.com",
    phone: "+1 (555) 123-4567",
    timeZone: "UTC-8 (Pacific Time)",
  })
  const [originalUserInfo, setOriginalUserInfo] = useState<UserInfo>({
    firstName: "Alexandra",
    lastName: "Smith",
    email: "alexsmith@content-mobbin.com",
    phone: "+1 (555) 123-4567",
    timeZone: "UTC-8 (Pacific Time)",
  })
  const [isEditingInfo, setIsEditingInfo] = useState(false)

  // Password Change Dialog State
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordChange, setPasswordChange] = useState<PasswordChange>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Theme
  const { theme, setTheme } = useTheme()

  // Organization State
  const [organization, setOrganization] = useState<Organization>({
    name: "Acme Inc",
    logo: "",
    plan: "pro",
    memberCount: 4,
    userRole: "owner",
    isDefault: true,
  })
  const [originalOrganization, setOriginalOrganization] = useState<Organization>({
    name: "Acme Inc",
    logo: "",
    plan: "pro",
    memberCount: 4,
    userRole: "owner",
    isDefault: true,
  })
  const [isEditingOrg, setIsEditingOrg] = useState(false)
  const [orgActionDialogOpen, setOrgActionDialogOpen] = useState(false)

  // Password Requirements
  const passwordRequirements: PasswordRequirement[] = [
    { id: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
    { id: "uppercase", label: "One uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
    { id: "lowercase", label: "One lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
    { id: "number", label: "One number (0-9)", test: (p) => /[0-9]/.test(p) },
    { id: "special", label: "One special character (!@#$%^&*)", test: (p) => /[!@#$%^&*]/.test(p) },
  ]

  // Calculate password strength
  useEffect(() => {
    const password = passwordChange.newPassword
    if (!password) {
      setPasswordStrength(0)
      return
    }

    let strength = 0
    if (password.length >= 8) strength += 20
    if (password.length >= 12) strength += 10
    if (/[A-Z]/.test(password)) strength += 20
    if (/[a-z]/.test(password)) strength += 20
    if (/[0-9]/.test(password)) strength += 15
    if (/[!@#$%^&*]/.test(password)) strength += 15

    setPasswordStrength(Math.min(strength, 100))
  }, [passwordChange.newPassword])

  const handlePasswordChange = (field: keyof PasswordChange, value: string) => {
    setPasswordChange((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdatePassword = async () => {
    setIsUpdatingPassword(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUpdatingPassword(false)
    setPasswordDialogOpen(false)
    setPasswordChange({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const isPasswordValid = () => {
    return (
      passwordChange.currentPassword &&
      passwordChange.newPassword &&
      passwordChange.confirmPassword &&
      passwordChange.newPassword === passwordChange.confirmPassword &&
      passwordRequirements.every((req) => req.test(passwordChange.newPassword))
    )
  }

  const getPasswordStrengthLabel = () => {
    if (passwordStrength < 40) return { label: "Weak", color: "text-red-600" }
    if (passwordStrength < 70) return { label: "Medium", color: "text-yellow-600" }
    return { label: "Strong", color: "text-green-600" }
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return "bg-red-500"
    if (passwordStrength < 70) return "bg-yellow-500"
    return "bg-green-500"
  }

  const handleSaveSettings = () => {
    console.log("Saving settings:", userInfo)
    setOriginalUserInfo(userInfo)
    setIsEditingInfo(false)
  }

  const handleCancelEdit = () => {
    setUserInfo(originalUserInfo)
    setIsEditingInfo(false)
  }

  const hasInfoChanged = () => {
    return JSON.stringify(userInfo) !== JSON.stringify(originalUserInfo)
  }

  // Organization helpers
  const getPlanLabel = (plan: Organization["plan"]) => {
    switch (plan) {
      case "free":
        return "Free"
      case "starter":
        return "Starter"
      case "pro":
        return "Pro"
      case "enterprise":
        return "Enterprise"
    }
  }

  const handleSaveOrganization = () => {
    setOriginalOrganization(organization)
    setIsEditingOrg(false)
  }

  const handleCancelOrgEdit = () => {
    setOrganization(originalOrganization)
    setIsEditingOrg(false)
  }

  const hasOrgChanged = () => {
    return organization.name !== originalOrganization.name || organization.logo !== originalOrganization.logo
  }

  const timeZones = [
    "UTC-12 (Baker Island)",
    "UTC-11 (American Samoa)",
    "UTC-10 (Hawaii)",
    "UTC-9 (Alaska)",
    "UTC-8 (Pacific Time)",
    "UTC-7 (Mountain Time)",
    "UTC-6 (Central Time)",
    "UTC-5 (Eastern Time)",
    "UTC-4 (Atlantic Time)",
    "UTC-3 (Buenos Aires)",
    "UTC-2 (Mid-Atlantic)",
    "UTC-1 (Azores)",
    "UTC+0 (London)",
    "UTC+1 (Paris)",
    "UTC+2 (Cairo)",
    "UTC+3 (Moscow)",
    "UTC+4 (Dubai)",
    "UTC+5 (Karachi)",
    "UTC+6 (Dhaka)",
    "UTC+7 (Bangkok)",
    "UTC+8 (Singapore)",
    "UTC+9 (Tokyo)",
    "UTC+10 (Sydney)",
    "UTC+11 (Solomon Islands)",
    "UTC+12 (Fiji)",
    "UTC+13 (Tonga)",
    "UTC+14 (Line Islands)",
  ]

  return (
    <div className="space-y-6">
      {/* BASIC INFORMATION CARD */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Basic Information</CardTitle>
            {!isEditingInfo && (
              <Button variant="outline" onClick={() => setIsEditingInfo(true)}>
                Edit Info
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Section */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src="" alt="Alex Smith" />
                <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-400 text-white font-semibold">
                  AS
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-[10px]">Change</span>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <div className="font-semibold">Alex Smith</div>
              <Badge variant="outline" className="w-fit border-red-500/50 text-red-700 dark:text-red-400">
                <Crown className="mr-1 h-3 w-3" />
                Owner
              </Badge>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="first-name"
                value={userInfo.firstName}
                onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                placeholder="Enter your first name"
                disabled={!isEditingInfo}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-name">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="last-name"
                value={userInfo.lastName}
                onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                placeholder="Enter your last name"
                disabled={!isEditingInfo}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                placeholder="Enter your email"
                disabled={!isEditingInfo}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                disabled={!isEditingInfo}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="timezone">Time Zone</Label>
              <Select 
                value={userInfo.timeZone} 
                onValueChange={(value) => setUserInfo({ ...userInfo, timeZone: value })}
                disabled={!isEditingInfo}
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select your time zone" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {timeZones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEditingInfo && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
              <Button onClick={handleSaveSettings} disabled={!hasInfoChanged()}>
                Save Changes
              </Button>
            </div>
          )}

          {/* Password */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div>
              <div className="font-medium">Password</div>
              <p className="text-sm text-muted-foreground">
                Change your password to keep your account secure
              </p>
            </div>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ORGANIZATION CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Organization Logo, Name, Member Count & Close/Leave Button */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border">
                {organization.logo ? (
                  <Avatar className="h-12 w-12 rounded-lg">
                    <AvatarImage src={organization.logo} alt={organization.name} />
                    <AvatarFallback className="rounded-lg">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Building2 className="h-6 w-6 text-primary" />
                )}
              </div>
              {isEditingOrg && (
                <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Upload className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              {isEditingOrg ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Input
                      value={organization.name}
                      onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                      className="font-semibold w-64"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleCancelOrgEdit}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSaveOrganization}
                      disabled={!hasOrgChanged()}
                      className="h-8 w-8"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{organization.memberCount} members</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{organization.name}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsEditingOrg(true)}
                      className="h-8 w-8"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{organization.memberCount} members</p>
                </div>
              )}
            </div>

            {!isEditingOrg && (
              <Button
                variant="outline"
                size="sm"
                className="text-destructive hover:text-destructive border-destructive/50 hover:bg-destructive/10"
                onClick={() => setOrgActionDialogOpen(true)}
                disabled={organization.isDefault}
              >
                {organization.userRole === "owner" ? "Close" : "Leave"}
              </Button>
            )}
          </div>

          {/* Plan */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Plan</div>
              <p className="text-sm text-muted-foreground">{getPlanLabel(organization.plan)}</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/billing-credits">Manage</a>
            </Button>
          </div>

          {/* Balance */}
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Balance</div>
              <p className="text-sm text-muted-foreground">$125.00</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href="/billing-credits?tab=purchase">Add Credits</a>
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* PERSONALISATION CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Personalisation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose how you want the interface to appear
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CHANGE PASSWORD DIALOG */}
      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordChange.currentPassword}
                onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                placeholder="Enter your current password"
                  className="pr-10"
              />
                <button
                type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={passwordChange.newPassword}
                onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                placeholder="Enter new password"
                  className="pr-10"
              />
                <button
                type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>

              {/* Password Strength */}
              {passwordChange.newPassword && (
                <div className="space-y-2">
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <p className={`text-xs font-medium ${getPasswordStrengthLabel().color}`}>
                    {getPasswordStrengthLabel().label}
                  </p>
                </div>
              )}

              {/* Requirements */}
              {passwordChange.newPassword && (
                <div className="rounded-lg bg-muted p-3 space-y-2">
                  <div className="text-sm font-medium">Password requirements:</div>
                  <div className="space-y-1">
                    {passwordRequirements.map((req) => {
                      const isMet = req.test(passwordChange.newPassword)
                      return (
                        <div key={req.id} className="flex items-center gap-2">
                          {isMet ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <X className="h-3 w-3 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">{req.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordChange.confirmPassword}
                  onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                  placeholder="Re-enter new password"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordChange.confirmPassword &&
                passwordChange.newPassword !== passwordChange.confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePassword} disabled={!isPasswordValid() || isUpdatingPassword}>
              {isUpdatingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ORGANIZATION ACTION DIALOG (Close/Leave) */}
      <Dialog open={orgActionDialogOpen} onOpenChange={setOrgActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {organization.userRole === "owner" ? "Close Organization" : "Leave Organization"}
            </DialogTitle>
            <DialogDescription>
              {organization.userRole === "owner"
                ? `Are you sure you want to close "${organization.name}"? This action cannot be undone.`
                : `Are you sure you want to leave "${organization.name}"?`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <div className="text-sm text-yellow-900 dark:text-yellow-100">
              {organization.userRole === "owner" ? (
                <>
                  <p className="font-medium">This will permanently:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li>Delete all organization data</li>
                    <li>Remove all team members</li>
                    <li>Cancel any active subscriptions</li>
                  </ul>
                </>
              ) : (
                <>
                  <p>You will lose access to:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5">
                    <li>All organization resources and data</li>
                    <li>Shared agents and knowledge bases</li>
                    <li>Team collaboration features</li>
                  </ul>
                </>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOrgActionDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive-outline" onClick={() => setOrgActionDialogOpen(false)}>
              {organization.userRole === "owner" ? "Close Organization" : "Leave Organization"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
