"use client"

import { useState, useCallback, useMemo } from "react"
import { Phone, ChevronRight, Check, MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/page-header"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for phone numbers
type PhoneNumber = {
  id: string
  label: string
  phoneNumber: string
  assignedAgent: string | null
  inboundStatus: "enabled" | "disabled"
  outboundStatus: "enabled" | "disabled"
}

const mockPhoneNumbers: PhoneNumber[] = [
  {
    id: "1",
    label: "Support Line",
    phoneNumber: "+1 (555) 123-4567",
    assignedAgent: "Customer Support Agent",
    inboundStatus: "enabled",
    outboundStatus: "disabled",
  },
  {
    id: "2",
    label: "Sales Line",
    phoneNumber: "+1 (555) 987-6543",
    assignedAgent: "Sales Outreach Agent",
    inboundStatus: "enabled",
    outboundStatus: "enabled",
  },
  {
    id: "3",
    label: "Scheduling Line",
    phoneNumber: "+1 (555) 456-7890",
    assignedAgent: null,
    inboundStatus: "disabled",
    outboundStatus: "disabled",
  },
]

export default function Page() {
  const [hasPhoneNumbers, setHasPhoneNumbers] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPhoneId, setSelectedPhoneId] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [enableInbound, setEnableInbound] = useState(false)
  const [enableOutbound, setEnableOutbound] = useState(false)
  const totalSteps = 3

  const handleDeleteClick = useCallback((id: string) => {
    setSelectedPhoneId(id)
    setIsDeleteDialogOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    console.log("Deleting phone number:", selectedPhoneId)
    setIsDeleteDialogOpen(false)
    setSelectedPhoneId(null)
  }, [selectedPhoneId])

  const selectedPhone = useMemo(
    () => mockPhoneNumbers.find((phone) => phone.id === selectedPhoneId),
    [selectedPhoneId]
  )

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : prev))
  }, [])

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev))
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (currentStep === totalSteps) {
      // Final submit
      setIsDialogOpen(false)
      setCurrentStep(1)
      setEnableInbound(false)
      setEnableOutbound(false)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }, [currentStep])

  const handleDialogOpenChange = useCallback((open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      // Reset state when opening dialog
      setCurrentStep(1)
      setEnableInbound(false)
      setEnableOutbound(false)
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Phone Numbers">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Phone className="h-4 w-4" />
              Import Number
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Configure SIP Trunk</DialogTitle>
                <DialogDescription>
                  {currentStep === 1 && "Basic Information"}
                  {currentStep === 2 && "Inbound Configuration"}
                  {currentStep === 3 && "Outbound Configuration"}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-6">
                {/* Step 1: Label & Phone Number */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid gap-3">
                      <Label htmlFor="label">Label</Label>
                      <Input
                        id="label"
                        placeholder="Support Line"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="phone-number">Phone Number</Label>
                      <Input
                        id="phone-number"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Inbound Configuration */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-inbound">Enable Inbound</Label>
                      <Switch
                        id="enable-inbound"
                        checked={enableInbound}
                        onCheckedChange={setEnableInbound}
                      />
                    </div>
                    {enableInbound && (
                      <>
                        <div className="grid gap-3">
                          <Label htmlFor="inbound-username">SIP Trunk Username</Label>
                          <Input
                            id="inbound-username"
                            placeholder="username"
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="inbound-password">SIP Trunk Password</Label>
                          <Input
                            id="inbound-password"
                            type="password"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: Outbound Configuration */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enable-outbound">Enable Outbound</Label>
                      <Switch
                        id="enable-outbound"
                        checked={enableOutbound}
                        onCheckedChange={setEnableOutbound}
                      />
                    </div>
                    {enableOutbound && (
                      <>
                        <div className="grid gap-3">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            placeholder="sip.example.com:5060"
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="outbound-username">SIP Trunk Username</Label>
                          <Input
                            id="outbound-username"
                            placeholder="username"
                            required
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="outbound-password">SIP Trunk Password</Label>
                          <Input
                            id="outbound-password"
                            type="password"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                  >
                    Back
                  </Button>
                )}
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="gap-2">
                  {currentStep === totalSteps ? (
                    <>
                      <Check className="h-4 w-4" />
                      Import Number
                    </>
                  ) : (
                    <>
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Delete Phone Number Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Phone Number</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this phone number? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPhone && (
            <div className="py-4">
              <div className="rounded-lg border p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Label</span>
                  <span className="font-semibold">{selectedPhone.label}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phone Number</span>
                  <span className="font-mono font-semibold">{selectedPhone.phoneNumber}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="phone-numbers" className="w-full flex-1 flex flex-col">
        <div className="px-0">
          <TabsList className="w-full">
            <TabsTrigger value="phone-numbers" className="flex-1">
              Phone Numbers
            </TabsTrigger>
            <TabsTrigger value="buy-number" className="flex-1 relative" disabled>
              Buy Number
              <Badge variant="outline" className="absolute top-1/2 -translate-y-1/2 right-2 text-xs border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-500">
                Coming Soon
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="phone-numbers" className="mt-4 flex-1 flex flex-col">
          <div className="flex-1 rounded-lg border bg-background shadow-sm">
            {!hasPhoneNumbers ? (
              <Empty className="min-h-[500px]">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Phone className="h-6 w-6" />
                  </EmptyMedia>
                  <EmptyTitle>No Phone Numbers Yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t added any phone numbers yet. Import a phone number to get started with your campaigns.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="overflow-hidden rounded-lg border m-6">
                <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[180px]">Label</TableHead>
                    <TableHead className="w-[180px]">Phone Number</TableHead>
                    <TableHead>Assigned Agent</TableHead>
                    <TableHead><div className="text-center">Inbound</div></TableHead>
                    <TableHead><div className="text-center">Outbound</div></TableHead>
                    <TableHead><div className="text-center">Status</div></TableHead>
                    <TableHead><div className="text-center">Actions</div></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPhoneNumbers.map((phoneNumber) => (
                    <TableRow key={phoneNumber.id}>
                      <TableCell className="font-semibold">{phoneNumber.label}</TableCell>
                      <TableCell className="font-mono">
                        {phoneNumber.phoneNumber}
                      </TableCell>
                      <TableCell className={phoneNumber.assignedAgent ? "" : "text-muted-foreground italic"}>
                        {phoneNumber.assignedAgent || "Not assigned"}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-muted-foreground px-1.5">
                            {phoneNumber.inboundStatus === "enabled" ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Badge variant="outline" className="text-muted-foreground px-1.5">
                            {phoneNumber.outboundStatus === "enabled" ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Switch defaultChecked />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                variant="destructive"
                                onClick={() => handleDeleteClick(phoneNumber.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete Number
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="buy-number" className="mt-4 flex-1 flex flex-col">
          <div className="flex-1 rounded-lg border bg-background shadow-sm">
            {/* Buy Number content will go here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}