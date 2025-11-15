"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Shield,
  Smartphone,
  MessageSquare,
  Key,
  Download,
  Copy,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Crown,
} from "lucide-react"

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

  // 2FA State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false)
  const [disableTwoFactorDialogOpen, setDisableTwoFactorDialogOpen] = useState(false)
  const [twoFactorStep, setTwoFactorStep] = useState(1)
  const [selectedAuthMethod, setSelectedAuthMethod] = useState<"app" | "sms" | null>(null)
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""])
  const [backupCodes] = useState([
    "A3B5-9D2F",
    "K7M1-4P8N",
    "R2T6-3W9Q",
    "F5H8-1L4S",
    "Z9X2-6C7V",
    "N4B8-5G1M",
    "P7Q3-2R6T",
    "W1Y5-9K4L",
    "D8S2-3F7H",
    "J6V9-4N1C",
  ])
  const [backupCodesConfirmed, setBackupCodesConfirmed] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState(false)

  // Theme
  const { theme, setTheme } = useTheme()

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

  // 2FA Functions
  const handleEnable2FA = () => {
    setTwoFactorDialogOpen(true)
    setTwoFactorStep(1)
    setSelectedAuthMethod(null)
    setOtpCode(["", "", "", "", "", ""])
    setBackupCodesConfirmed(false)
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    
    const newOtp = [...otpCode]
    newOtp[index] = value.slice(-1)
    setOtpCode(newOtp)
    setOtpError(false)

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    setIsVerifyingOtp(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    if (otpCode.every((digit) => digit !== "")) {
      setIsVerifyingOtp(false)
      setTwoFactorStep(4)
    } else {
      setIsVerifyingOtp(false)
      setOtpError(true)
      setOtpCode(["", "", "", "", "", ""])
    }
  }

  useEffect(() => {
    if (otpCode.every((digit) => digit !== "")) {
      handleVerifyOtp()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otpCode])

  const handleComplete2FASetup = () => {
    setTwoFactorEnabled(true)
    setTwoFactorDialogOpen(false)
  }

  const handleDisable2FA = () => {
    setTwoFactorEnabled(false)
    setDisableTwoFactorDialogOpen(false)
  }

  const handleDownloadBackupCodes = () => {
    const text = backupCodes.join("\n")
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "backup-codes.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopyBackupCodes = async () => {
    await navigator.clipboard.writeText(backupCodes.join("\n"))
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
        </CardContent>
      </Card>

      {/* SECURITY CARD */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password */}
          <div className="flex items-center justify-between">
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

          {/* Two-Factor Authentication */}
          <div>
            <div className="flex items-center justify-between">
              <div className="font-medium">Two-factor authentication (2FA)</div>
              {!twoFactorEnabled && (
                <Button variant="outline" onClick={handleEnable2FA}>
                  Enable 2FA
                </Button>
              )}
            </div>
            
            {!twoFactorEnabled ? (
              <p className="text-sm text-muted-foreground">
                Two-factor authentication is currently disabled.{" "}
                <a href="#" className="text-primary hover:underline">
                  Learn more
                </a>
              </p>
            ) : (
              <div className="space-y-4 mt-4">
                {/* 2FA Enabled State */}
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-green-900 dark:text-green-100">
                      Two-factor authentication is enabled. Your account is protected.
                    </p>
                  </div>
                </div>

                {/* Active Method */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Authenticator App</div>
                      <div className="text-sm text-muted-foreground">Active since Nov 1, 2024</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-green-500/50 text-green-700 dark:text-green-400">
                    Active
                  </Badge>
                </div>

                {/* Disable Button */}
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => setDisableTwoFactorDialogOpen(true)}
                  >
                    Disable 2FA
                  </Button>
                </div>
              </div>
            )}
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

      {/* ENABLE 2FA DIALOG */}
      <Dialog open={twoFactorDialogOpen} onOpenChange={setTwoFactorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication - Step {twoFactorStep} of 4</DialogTitle>
            <DialogDescription>
              {twoFactorStep === 1 && "Choose your authentication method"}
              {twoFactorStep === 2 && "Scan the QR code with your authenticator app"}
              {twoFactorStep === 3 && "Enter the verification code"}
              {twoFactorStep === 4 && "Save your backup codes"}
            </DialogDescription>
          </DialogHeader>

          {/* STEP 1: Choose Method */}
          {twoFactorStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Authenticator App */}
                <div
                  className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer ${
                    selectedAuthMethod === "app" ? "border-primary" : "border-border"
                  }`}
                  onClick={() => setSelectedAuthMethod("app")}
                >
                  <Smartphone className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Authenticator App</span>
                      <Badge className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border-0">Recommended</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use Google Authenticator, Authy, or similar apps
                    </p>
                  </div>
                </div>

                {/* SMS */}
                <div
                  className={`flex items-center gap-3 rounded-lg border p-4 cursor-pointer ${
                    selectedAuthMethod === "sms" ? "border-primary" : "border-border"
                  }`}
                  onClick={() => setSelectedAuthMethod("sms")}
                >
                  <MessageSquare className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <span className="font-medium">SMS (Text Message)</span>
                    <p className="text-sm text-muted-foreground mt-1">
                      Receive codes via text message
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setTwoFactorDialogOpen(false)}>
                  Cancel
                </Button>
                <Button disabled={!selectedAuthMethod} onClick={() => setTwoFactorStep(2)}>
                  Continue
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP 2: Scan QR */}
          {twoFactorStep === 2 && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-48 h-48 border rounded-lg p-4 bg-muted flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">QR Code</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Or enter this code manually</Label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm bg-muted px-3 py-2 rounded font-mono">
                    JBSWY3DPEHPK3PXP
                  </code>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setTwoFactorStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setTwoFactorStep(3)}>Continue</Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP 3: Verify */}
          {twoFactorStep === 3 && (
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {otpCode.map((digit, index) => (
                  <Input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-mono"
                  />
                ))}
              </div>

              {isVerifyingOtp && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verifying...</span>
                </div>
              )}

              {otpError && (
                <div className="flex items-center justify-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>Invalid code. Please try again.</span>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setTwoFactorStep(2)}>
                  Back
                </Button>
                <Button
                  disabled={otpCode.some((d) => !d) || isVerifyingOtp}
                  onClick={handleVerifyOtp}
                >
                  Verify
                </Button>
              </DialogFooter>
            </div>
          )}

          {/* STEP 4: Backup Codes */}
          {twoFactorStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
                <p className="text-sm text-yellow-900 dark:text-yellow-100">
                  Save these codes in a safe place. You'll need them if you lose your device.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-muted rounded-lg">
                {backupCodes.map((code, i) => (
                  <code key={i} className="text-sm font-mono bg-background px-2 py-1.5 rounded text-center">
                    {code}
                  </code>
                ))}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={handleDownloadBackupCodes}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleCopyBackupCodes}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="confirm-saved"
                  checked={backupCodesConfirmed}
                  onCheckedChange={(checked) => setBackupCodesConfirmed(checked === true)}
                />
                <Label htmlFor="confirm-saved" className="text-sm cursor-pointer">
                  I have saved my backup codes in a safe place
                </Label>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setTwoFactorStep(3)}>
                  Back
                </Button>
                <Button
                  disabled={!backupCodesConfirmed}
                  onClick={handleComplete2FASetup}
                >
                  Complete Setup
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DISABLE 2FA CONFIRMATION DIALOG */}
      <Dialog open={disableTwoFactorDialogOpen} onOpenChange={setDisableTwoFactorDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Are you sure you want to disable two-factor authentication? This will make your account less secure.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-900 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              Your account will be more vulnerable to unauthorized access without 2FA protection.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDisableTwoFactorDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive-outline" onClick={handleDisable2FA}>
              Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
