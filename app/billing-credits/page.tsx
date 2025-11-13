"use client"

import { useState } from "react"
import { PageHeader } from "@/components/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription, CardAction } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Info, CircleSlash, Mail, AlertTriangle, CreditCard, Pencil, Trash2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Page() {
  const [customAmount, setCustomAmount] = useState(50)
  const [savePaymentMethod, setSavePaymentMethod] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  
  // Billing Settings states
  const [autoRechargeEnabled, setAutoRechargeEnabled] = useState(false)
  const [refillAmount, setRefillAmount] = useState(10)
  const [refillThreshold, setRefillThreshold] = useState(5)
  const [alertRecipients, setAlertRecipients] = useState("")
  const [criticalAlertEnabled, setCriticalAlertEnabled] = useState(false)
  const [isEditBillingDialogOpen, setIsEditBillingDialogOpen] = useState(false)
  const [isAddPaymentDialogOpen, setIsAddPaymentDialogOpen] = useState(false)
  
  // Initial values for auto recharge (stored as state to update after save)
  const [initialRefillAmount, setInitialRefillAmount] = useState(10)
  const [initialRefillThreshold, setInitialRefillThreshold] = useState(5)
  
  // Check if auto recharge values changed
  const hasAutoRechargeChanged = refillAmount !== initialRefillAmount || refillThreshold !== initialRefillThreshold
  
  // Handle auto recharge save
  const handleAutoRechargeSave = () => {
    // Save logic here (API call, etc.)
    console.log("Saving auto recharge settings:", { refillAmount, refillThreshold })
    
    // Update initial values to current values
    setInitialRefillAmount(refillAmount)
    setInitialRefillThreshold(refillThreshold)
  }
  
  // Initial values for credit alert settings
  const [initialAlertRecipients, setInitialAlertRecipients] = useState("")
  const [initialCriticalAlertEnabled, setInitialCriticalAlertEnabled] = useState(false)
  
  // Check if credit alert settings changed
  const hasAlertSettingsChanged = alertRecipients !== initialAlertRecipients || criticalAlertEnabled !== initialCriticalAlertEnabled
  
  // Handle credit alert settings save
  const handleAlertSettingsSave = () => {
    // Save logic here (API call, etc.)
    console.log("Saving credit alert settings:", { alertRecipients, criticalAlertEnabled })
    
    // Update initial values to current values
    setInitialAlertRecipients(alertRecipients)
    setInitialCriticalAlertEnabled(criticalAlertEnabled)
  }
  
  // Billing Information data
  const [billingName, setBillingName] = useState("Yiğitalp Özcan")
  const [billingPhone, setBillingPhone] = useState("+90 555 555 55 55")
  const [billingEmail, setBillingEmail] = useState("example@example.com")
  const [addressLine1, setAddressLine1] = useState("1226 University Dr")
  const [addressLine2, setAddressLine2] = useState("")
  const [city, setCity] = useState("Menlo Park")
  const [stateProvince, setStateProvince] = useState("CA")
  const [postalCode, setPostalCode] = useState("94025")
  const [country, setCountry] = useState("United States of America")

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0
    setCustomAmount(value)
  }

  const handlePurchase = (amount: number) => {
    console.log(`Purchasing $${amount} worth of credits`)
    // Implement purchase logic here
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Billing & Credits" />
      <div className="flex-1">
        <Tabs defaultValue="plan" className="w-full">
          <TabsList>
            <TabsTrigger value="plan">Plan & Limits</TabsTrigger>
            <TabsTrigger value="purchase">Purchase Credits</TabsTrigger>
            <TabsTrigger value="settings">Billing Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="plan" className="mt-2 space-y-6">
            <Card className="gap-3 py-4">
              <CardHeader>
                <CardTitle className="text-lg">Limits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hourly Limit</span>
                      <span className="font-medium">20 / 100</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Limit</span>
                      <span className="font-medium">40 / 100</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Plan Kartları Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Start Plan */}
              <Card className="relative transition-all border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]">
                <CardHeader>
                  <CardTitle className="text-xl">Start</CardTitle>
                  <CardAction>
                    <Badge variant="outline" className="gap-1.5 border-primary text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      Current
                    </Badge>
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Cap:</span>
                    <span className="font-medium">100 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hourly Cap:</span>
                    <span className="font-medium">100 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Concurrency:</span>
                    <span className="font-medium">10 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voice Limit:</span>
                    <span className="font-medium">1 clones</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Knowledge Bases:</span>
                    <span className="font-medium">10 knowledge bases</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Base Plan
                  </Button>
                </CardFooter>
              </Card>

              {/* Build Plan */}
              <Card className="relative hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Build</CardTitle>
                  <CardAction>
                    <span className="text-2xl font-bold">$299</span>
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Cap:</span>
                    <span className="font-medium">2,000 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hourly Cap:</span>
                    <span className="font-medium">1,000 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Concurrency:</span>
                    <span className="font-medium">50 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voice Limit:</span>
                    <span className="font-medium">5 clones</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Knowledge Bases:</span>
                    <span className="font-medium">50 knowledge bases</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Increase Scale
                  </Button>
                </CardFooter>
              </Card>

              {/* Scale Plan */}
              <Card className="relative hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Scale</CardTitle>
                  <CardAction>
                    <span className="text-2xl font-bold">$499</span>
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Cap:</span>
                    <span className="font-medium">5,000 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hourly Cap:</span>
                    <span className="font-medium">1,000 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Concurrency:</span>
                    <span className="font-medium">100 calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voice Limit:</span>
                    <span className="font-medium">15 clones</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Knowledge Bases:</span>
                    <span className="font-medium">100 knowledge bases</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Increase Scale
                  </Button>
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className="relative hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">Enterprise</CardTitle>
                  <CardAction>
                    <span className="text-lg font-semibold text-muted-foreground">Contact Us</span>
                  </CardAction>
                </CardHeader>
                <Separator />
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Daily Cap:</span>
                    <span className="font-medium">Unlimited calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hourly Cap:</span>
                    <span className="font-medium">Unlimited calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Concurrency:</span>
                    <span className="font-medium">Unlimited calls</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Voice Limit:</span>
                    <span className="font-medium">Unlimited clones</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Knowledge Bases:</span>
                    <span className="font-medium">Unlimited knowledge bases</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">
                    Contact Us
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="purchase" className="mt-2 space-y-6">
            {/* Mevcut Bakiye Kartı */}
            <Card className="gap-3 py-4">
              <CardHeader>
                <CardTitle className="text-lg">Current Balance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">1.85</span>
                  <span className="text-muted-foreground">credits</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Blend bills at $0.08/minute, pro-rated to the exact second, and only for call time (dial time excluded).
                </p>
              </CardContent>
            </Card>


            {/* Purchase Credits Bölümü */}
            <Card className="gap-3 py-4">
              <CardHeader>
                <CardTitle className="text-lg">Purchase Credits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Önceden Tanımlı Paketler */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* $10 Paketi */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPackage === 10
                        ? 'border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]'
                        : 'hover:shadow-md'
                        }`}
                      onClick={() => setSelectedPackage(10)}
                    >
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold">$10</div>
                          <p className="text-sm text-muted-foreground mt-2">
                            125 minutes of call time. Priority queue. Reduced latency.
                          </p>
                        </div>
                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePurchase(10)
                          }}
                        >
                          Purchase
                        </Button>
                      </div>
                    </div>

                    {/* $20 Paketi */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPackage === 20
                        ? 'border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]'
                        : 'hover:shadow-md'
                        }`}
                      onClick={() => setSelectedPackage(20)}
                    >
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold">$20</div>
                          <p className="text-sm text-muted-foreground mt-2">
                            250 minutes of call time. Priority queue. Reduced latency.
                          </p>
                        </div>
                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePurchase(20)
                          }}
                        >
                          Purchase
                        </Button>
                      </div>
                    </div>

                    {/* $50 Paketi */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedPackage === 50
                        ? 'border-primary shadow-[0_0_0_3px_hsl(var(--primary)/0.1)]'
                        : 'hover:shadow-md'
                        }`}
                      onClick={() => setSelectedPackage(50)}
                    >
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold">$50</div>
                          <p className="text-sm text-muted-foreground mt-2">
                            625 minutes of call time. Priority queue. Reduced latency.
                          </p>
                        </div>
                        <Button
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation()
                            handlePurchase(50)
                          }}
                        >
                          Purchase
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Custom Amount Bölümü */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Custom Amount</h4>
                  <div className="space-y-4">
                    <div className="flex gap-3 items-end">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="custom-amount">Amount ($)</Label>
                        <Input
                          id="custom-amount"
                          type="number"
                          min="1"
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                          className="w-full"
                        />
                      </div>

                      <Button size="default" onClick={() => handlePurchase(customAmount)}
                        disabled={customAmount <= 0} className="w-full sm:w-auto" >
                        Purchase {customAmount}
                         credits (${customAmount})
                      </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="save-payment"
                        checked={savePaymentMethod}
                        onCheckedChange={(checked) => setSavePaymentMethod(checked as boolean)}
                      />
                      <label
                        htmlFor="save-payment"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Save payment method after checkout
                      </label>
                    </div>

                    <div className="flex items-start gap-2 text-xs text-muted-foreground pt-2">
                      <Info className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>Credit purchases made with a bank account may take a few days to process.</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Auto Recharge & Credit Alert Settings - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Auto Recharge Card */}
              <Card className="gap-3 py-4">
                <CardHeader>
                  <CardTitle className="text-lg">Auto Recharge</CardTitle>
                  <CardAction>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {autoRechargeEnabled ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={autoRechargeEnabled}
                        onCheckedChange={setAutoRechargeEnabled}
                      />
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground -mt-1">
                    Automatically refill your credits whenever your balance is low, so that you never run out. Select your refill amount and threshold below.
                  </p>

                  <Separator />

                  {/* Refill Inputs - Side by Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Refill Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="refill-amount">Refill Amount ($)</Label>
                      <Input
                        id="refill-amount"
                        type="number"
                        min="1"
                        value={refillAmount}
                        onChange={(e) => setRefillAmount(parseInt(e.target.value) || 0)}
                        disabled={!autoRechargeEnabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        The number of credits to purchase at a time.
                      </p>
                    </div>

                    {/* Refill Threshold */}
                    <div className="space-y-2">
                      <Label htmlFor="refill-threshold">Refill Threshold ($)</Label>
                      <Input
                        id="refill-threshold"
                        type="number"
                        min="1"
                        value={refillThreshold}
                        onChange={(e) => setRefillThreshold(parseInt(e.target.value) || 0)}
                        disabled={!autoRechargeEnabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        Refill your credits automatically any time your balance falls below this amount.
                      </p>
                    </div>
                  </div>

                  {autoRechargeEnabled && hasAutoRechargeChanged && (
                    <Button className="w-full" onClick={handleAutoRechargeSave}>
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Credit Alert Settings Card */}
              <Card className="gap-3 py-4">
                <CardHeader>
                  <CardTitle className="text-lg">Credit Alert Settings</CardTitle>
                  <CardAction>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {criticalAlertEnabled ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={criticalAlertEnabled}
                        onCheckedChange={setCriticalAlertEnabled}
                      />
                    </div>
                  </CardAction>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground -mt-1">
                    Get notified when your credits are running low to avoid service interruptions.
                  </p>

                  <Separator />

                  <div className="space-y-4">
                    {/* Alert Recipients */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="alert-recipients">Alert recipients</Label>
                      </div>
                      <Input
                        id="alert-recipients"
                        type="email"
                        placeholder="e.g. dev@example.com, ops@example.com"
                        value={alertRecipients}
                        onChange={(e) => setAlertRecipients(e.target.value)}
                        disabled={!criticalAlertEnabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        You can enter multiple email addresses separated by commas.
                      </p>
                    </div>
                  </div>

                  {criticalAlertEnabled && hasAlertSettingsChanged && (
                    <Button className="w-full" onClick={handleAlertSettingsSave}>
                      Save Changes
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
            </TabsContent>

          

          <TabsContent value="settings" className="mt-2 space-y-6">
            {/* Billing Details Card - Combined */}
            <Card className="gap-3 py-4">
              <CardHeader>
                <CardTitle className="text-lg">Billing Details</CardTitle>
                <CardAction>
                  <Button variant="outline" size="sm">
                    Manage Billing
                  </Button>
                </CardAction>
              </CardHeader>
              
              <Separator />
              
              <CardContent className="space-y-4">
                {/* Current Plan */}
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm font-normal text-muted-foreground">Current Plan</Label>
                  <div className="flex items-center gap-2">
                    <Button variant="link" className="h-auto p-0 text-sm font-medium">
                      Start
                    </Button>
                    <span className="text-sm text-muted-foreground">•</span>
                    <span className="text-sm font-medium">$0/month</span>
                  </div>
                </div>

                <Separator />

                {/* Available Credits */}
                <div className="flex items-center justify-between py-2">
                  <Label className="text-sm font-normal text-muted-foreground">Available Credits</Label>
                  <span className="text-sm font-medium">1.85</span>
                </div>

                <Separator />

                {/* Billing Information & Payment Methods - Side by Side with Vertical Separator */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6">
                  {/* Billing Information Section */}
                  <div className="flex flex-col min-h-[250px]">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium">Billing Information</h3>
                    </div>

                    <div className="space-y-4 flex-1">
                      {/* Name */}
                      <div>
                        <Label className="text-xs text-muted-foreground">Name</Label>
                        <p className="text-sm font-medium mt-1">{billingName}</p>
                      </div>

                      {/* Phone */}
                      <div>
                        <Label className="text-xs text-muted-foreground">Phone</Label>
                        <p className="text-sm font-medium mt-1">{billingPhone}</p>
                      </div>

                      {/* Billing Email */}
                      <div>
                        <Label className="text-xs text-muted-foreground">Billing Email</Label>
                        <p className="text-sm font-medium mt-1">{billingEmail}</p>
                      </div>

                      {/* Address */}
                      <div>
                        <Label className="text-xs text-muted-foreground">Address</Label>
                        <div className="text-sm font-medium mt-1 space-y-0.5">
                          <p>{addressLine1}</p>
                          {addressLine2 && <p>{addressLine2}</p>}
                          <p>{city}</p>
                          <p>{stateProvince}</p>
                          <p>{postalCode}</p>
                          <p>{country}</p>
                        </div>
                      </div>
                    </div>

                    <Button variant="outline" size="default" className="w-full mt-4"
                        onClick={() => setIsEditBillingDialogOpen(true)}
                    >
                      Update billing details
                    </Button>
                  </div>

                  {/* Vertical Separator - Desktop only */}
                  <div className="hidden lg:block">
                    <Separator orientation="vertical" className="h-full" />
                  </div>

                  {/* Horizontal Separator - Mobile only */}
                  <Separator className="lg:hidden" />

                  {/* Payment Methods Section */}
                  <div className="flex flex-col min-h-[250px]">
                    <h3 className="text-sm font-medium mb-4">Payment Methods</h3>

                    <div className="flex-1">
                      {/* Payment Card */}
                      <div className="border rounded-lg p-4 flex items-center justify-between gap-4">
                        {/* Left: Card Info */}
                        <div className="flex items-center gap-3 flex-1">
                          {/* MasterCard SVG Icon */}
                          <svg 
                            viewBox="0 0 48 48" 
                            className="h-10 w-10"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="15" cy="24" r="12" fill="#EB001B" />
                            <circle cx="33" cy="24" r="12" fill="#FF5F00" />
                            <path 
                              d="M24 14.4c-2.8 2.4-4.5 6-4.5 9.6s1.7 7.2 4.5 9.6c2.8-2.4 4.5-6 4.5-9.6s-1.7-7.2-4.5-9.6z" 
                              fill="#F79E1B"
                            />
                          </svg>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">MasterCard ending ****</span>
                              <Badge 
                                variant="secondary" 
                                className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                              >
                                Primary
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">Expires **/**</p>
                          </div>
                        </div>

                        {/* Right: Action Buttons */}
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      size="default"
                      className="w-full mt-4"
                      onClick={() => setIsAddPaymentDialogOpen(true)}
                    >
                      Add payment method
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="gap-3 py-4">
            <CardHeader>
              <CardTitle className="text-lg">Credit Purchase History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground -mt-1">
                View your credit top-up history and download invoices.
              </p>
              <Separator />
              <div className="flex flex-col items-center justify-center py-12">
                <CircleSlash className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No purchase history found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>
      </div>

      {/* Edit Billing Information Dialog */}
      <Dialog open={isEditBillingDialogOpen} onOpenChange={setIsEditBillingDialogOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Billing Information</DialogTitle>
            <DialogDescription>
              Update your billing information. This will be displayed on your invoices.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="dialog-billing-name">Name</Label>
              <Input
                id="dialog-billing-name"
                value={billingName}
                onChange={(e) => setBillingName(e.target.value)}
                placeholder="Your name or organization name"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="dialog-billing-phone">Phone</Label>
              <Input
                id="dialog-billing-phone"
                type="tel"
                value={billingPhone}
                onChange={(e) => setBillingPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            {/* Billing Email */}
            <div className="space-y-2">
              <Label htmlFor="dialog-billing-email">Billing Email</Label>
              <Input
                id="dialog-billing-email"
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>

            {/* Address Line 1 */}
            <div className="space-y-2">
              <Label htmlFor="dialog-address-1">Address</Label>
              <Input
                id="dialog-address-1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="1226 University Dr"
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-2">
              <Label htmlFor="dialog-address-2">Address Line 2 (optional)</Label>
              <Input
                id="dialog-address-2"
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="dialog-city">City</Label>
                <Input
                  id="dialog-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Menlo Park"
                />
              </div>

              {/* State/Province */}
              <div className="space-y-2">
                <Label htmlFor="dialog-state">State/Province</Label>
                <Input
                  id="dialog-state"
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  placeholder="CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Postal Code */}
              <div className="space-y-2">
                <Label htmlFor="dialog-postal">Postal Code</Label>
                <Input
                  id="dialog-postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="94025"
                />
              </div>

              {/* Country */}
              <div className="space-y-2">
                <Label htmlFor="dialog-country">Country</Label>
                <Input
                  id="dialog-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="United States of America"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditBillingDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsEditBillingDialogOpen(false)}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Payment Method Dialog */}
      <Dialog open={isAddPaymentDialogOpen} onOpenChange={setIsAddPaymentDialogOpen}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Add a new payment method to your account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Card Holder Name */}
            <div className="space-y-2">
              <Label htmlFor="card-holder-name">Card Holder Name</Label>
              <Input
                id="card-holder-name"
                placeholder="John Doe"
              />
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <Label htmlFor="card-number">Card Number</Label>
              <Input
                id="card-number"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date</Label>
                <Input
                  id="expiry-date"
                  placeholder="MM/YY"
                  maxLength={5}
                />
              </div>

              {/* CVV */}
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={4}
                />
              </div>
            </div>

            {/* Make Primary */}
            <div className="flex items-center space-x-2">
              <Checkbox id="make-primary" />
              <label
                htmlFor="make-primary"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Set as primary payment method
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddPaymentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAddPaymentDialogOpen(false)}>
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



