"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  ArrowLeft, 
  Search, 
  X, 
  Eye, 
  Phone, 
  Calendar, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MoreVertical,
  Trash2
} from "lucide-react"
import { getCampaignStatusConfig, type CampaignStatusType } from "@/lib/helpers"
import { cn } from "@/lib/utils"

// Mock campaign data
type Campaign = {
  id: string
  batchName: string
  status: CampaignStatusType
  progress: number
  totalCalls: number
  completedCalls: number
  agentName: string
  pathwayName: string
  tools: string[]
  firstSentence: string
  taskPrompt: string
  summaryPrompt: string
  scheduledDate: string
  startDate?: string
  createdAt: string
  isStarted: boolean
}

type CallStatus = "pending" | "completed" | "canceled" | "missed"

type Call = {
  id: string
  callId: string
  recipientName: string
  phoneNumber: string
  status: CallStatus
  duration?: string
  timeStamp?: string
  notes: string
}

const mockCampaign: Campaign = {
  id: "1",
  batchName: "Q4 Product Launch Campaign",
  status: "continuing",
  progress: 65,
  totalCalls: 1000,
  completedCalls: 650,
  agentName: "Sales Outreach Agent",
  pathwayName: "Standard Call Flow",
  tools: ["Calendar Booking", "CRM Integration", "Email Sender"],
  firstSentence: "Hello! This is calling from TechCorp. How are you today?",
  taskPrompt: "Your task is to schedule an appointment with the customer for a product demo. Be polite and professional, and ensure to collect their preferred date and time.",
  summaryPrompt: "Summarize the call outcome, mention if appointment was scheduled, and note any follow-up actions required.",
  scheduledDate: "2024-11-15",
  startDate: "2024-11-15",
  createdAt: "2024-11-10",
  isStarted: true,
}

const mockCalls: Call[] = [
  {
    id: "1",
    callId: "CALL-001",
    recipientName: "John Doe",
    phoneNumber: "+1 (555) 123-4567",
    status: "completed",
    duration: "3:45",
    timeStamp: "2024-11-15 10:30 AM",
    notes: "Interested in premium package",
  },
  {
    id: "2",
    callId: "CALL-002",
    recipientName: "Jane Smith",
    phoneNumber: "+1 (555) 234-5678",
    status: "completed",
    duration: "2:15",
    timeStamp: "2024-11-15 11:00 AM",
    notes: "Requested callback next week",
  },
  {
    id: "3",
    callId: "CALL-003",
    recipientName: "Mike Johnson",
    phoneNumber: "+1 (555) 345-6789",
    status: "pending",
    notes: "Scheduled for 2 PM",
  },
  {
    id: "4",
    callId: "CALL-004",
    recipientName: "Sarah Williams",
    phoneNumber: "+1 (555) 456-7890",
    status: "pending",
    notes: "Do not call before 2 PM",
  },
  {
    id: "5",
    callId: "CALL-005",
    recipientName: "David Brown",
    phoneNumber: "+1 (555) 567-8901",
    status: "completed",
    duration: "5:20",
    timeStamp: "2024-11-15 09:45 AM",
    notes: "VIP client, follow-up scheduled",
  },
  {
    id: "6",
    callId: "CALL-006",
    recipientName: "Emily Davis",
    phoneNumber: "+1 (555) 678-9012",
    status: "pending",
    notes: "Preferred contact: afternoons",
  },
  {
    id: "7",
    callId: "CALL-007",
    recipientName: "Robert Wilson",
    phoneNumber: "+1 (555) 789-0123",
    status: "canceled",
    duration: "0:30",
    timeStamp: "2024-11-15 01:15 PM",
    notes: "Customer not available",
  },
  {
    id: "8",
    callId: "CALL-008",
    recipientName: "Lisa Anderson",
    phoneNumber: "+1 (555) 890-1234",
    status: "pending",
    notes: "Call back tomorrow",
  },
  {
    id: "9",
    callId: "CALL-009",
    recipientName: "Michael Thompson",
    phoneNumber: "+1 (555) 901-2345",
    status: "missed",
    duration: "0:00",
    timeStamp: "2024-11-15 03:00 PM",
    notes: "No answer, left voicemail",
  },
]

export default function CampaignDetailPage() {
  const router = useRouter()
  const params = useParams()
  const campaignId = params.id as string

  const [calls, setCalls] = useState<Call[]>(mockCalls)
  const [selectedCalls, setSelectedCalls] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | CallStatus>("all")
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCall, setSelectedCall] = useState<Call | null>(null)
  const [isActive, setIsActive] = useState(true)

  // Filter calls
  const filteredCalls = calls.filter((call) => {
    const matchesSearch =
      call.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.phoneNumber.includes(searchQuery) ||
      call.notes.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || call.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Paginate calls
  const paginatedCalls = filteredCalls.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )

  const totalPages = Math.ceil(filteredCalls.length / pageSize)

  const handleCancelSelected = () => {
    setCalls(calls.filter((c) => !selectedCalls.includes(c.id)))
    setSelectedCalls([])
    setIsCancelDialogOpen(false)
  }

  const handleViewDetail = (call: Call) => {
    setSelectedCall(call)
    setIsDetailDialogOpen(true)
  }

  const handleDeleteCampaign = () => {
    // Delete only pending and canceled calls
    // Completed and missed calls remain in call logs
    router.push("/campaigns")
  }

  const getCallStatusConfig = (status: CallStatus) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          icon: <Clock className="h-4 w-4 text-muted-foreground" />,
        }
      case "completed":
        return {
          label: "Completed",
          icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        }
      case "canceled":
        return {
          label: "Canceled",
          icon: <XCircle className="h-4 w-4 text-red-500" />,
        }
      case "missed":
        return {
          label: "Missed",
          icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
        }
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title={mockCampaign.batchName}>
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/campaigns")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Button>
      </PageHeader>

      <div className="flex-1 rounded-lg border bg-background shadow-sm p-6">
        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Campaign Summary</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Overview of campaign status and configuration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium cursor-pointer">
                {isActive ? "Active" : "Paused"}
              </span>
              <Switch
                id="campaign-toggle"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    variant="destructive"
                    className="text-red-600 focus:text-red-600 cursor-pointer"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Campaign
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>      
        <CardContent className="space-y-4">
          {/* Batch Name */}
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Batch Name</span>
            <span className="text-sm font-medium">{mockCampaign.batchName}</span>
          </div>
          
          {/* Status */}
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge
              variant="outline"
              className={`gap-1.5 ${getCampaignStatusConfig(mockCampaign.status).color}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${getCampaignStatusConfig(mockCampaign.status).dotColor}`}
              ></span>
              {getCampaignStatusConfig(mockCampaign.status).label}
            </Badge>
          </div>

          {/* Recipients */}
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Recipients</span>
            <span className="text-sm font-medium">{mockCampaign.totalCalls} contacts</span>
          </div>

          {/* First Sentence */}
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">First Sentence</span>
            <span className="text-sm font-medium text-right max-w-[60%] truncate">
              {mockCampaign.firstSentence}
            </span>
          </div>

          {/* Task Prompt */}
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Task Prompt</span>
            <span className="text-sm font-medium text-right max-w-[60%] truncate">
              {mockCampaign.taskPrompt}
            </span>
          </div>

          {/* Summary Prompt */}
          <div className="flex items-center justify-between py-2 border-b">
            <span className="text-sm text-muted-foreground">Summary Prompt</span>
            <span className="text-sm font-medium text-right max-w-[60%] truncate">
              {mockCampaign.summaryPrompt}
            </span>
          </div>

          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Progress</span>
              <span className="text-sm font-bold">{mockCampaign.progress}%</span>
            </div>
            <Progress value={mockCampaign.progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{mockCampaign.completedCalls} of {mockCampaign.totalCalls} completed</span>
              <span>{mockCampaign.totalCalls - mockCampaign.completedCalls} remaining</span>
            </div>
          </div>

          <Separator />

          {/* Campaign Information Section */}
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Agent */}
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Agent</p>
                  <p className="text-sm font-medium truncate">{mockCampaign.agentName}</p>
                </div>
              </div>

              {/* Pathway */}
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg className="h-4 w-4 text-primary" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Pathway</p>
                  <p className="text-sm font-medium truncate">{mockCampaign.pathwayName}</p>
                </div>
              </div>

              {/* Tools */}
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <svg className="h-4 w-4 text-primary" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">Tools</p>
                  <div className="flex flex-wrap gap-1">
                    {mockCampaign.tools.map((tool, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Planned Date or Start Date */}
              <div className="flex items-center gap-3 rounded-lg border bg-muted/30 p-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-1">
                    {mockCampaign.isStarted ? "Start Date" : "Planned Date"}
                  </p>
                  <p className="text-sm font-medium">
                    {mockCampaign.isStarted && mockCampaign.startDate
                      ? new Date(mockCampaign.startDate).toLocaleDateString()
                      : new Date(mockCampaign.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
          </Card>

          {/* Calls Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Calls ({calls.length})</h3>
              {selectedCalls.length > 0 && (
                <Button
                  variant="destructive-outline"
                  size="sm"
                  onClick={() => setIsCancelDialogOpen(true)}
                  className="gap-2"
                >
                  <X className="h-4 w-4" />
                  Cancel Selected ({selectedCalls.length})
                </Button>
              )}
            </div>

            {/* Search and Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search calls..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(0)
                  }}
                  className="pl-9"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value: "all" | CallStatus) => {
                  setStatusFilter(value)
                  setCurrentPage(0)
                }}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={
                            filteredCalls.length > 0 &&
                            filteredCalls
                              .filter((c) => c.status === "pending")
                              .every((c) => selectedCalls.includes(c.id))
                          }
                          onCheckedChange={(checked) => {
                            const pendingCalls = filteredCalls.filter(
                              (c) => c.status === "pending"
                            )
                            if (checked) {
                              const pendingIds = pendingCalls.map((c) => c.id)
                              setSelectedCalls([
                                ...new Set([...selectedCalls, ...pendingIds]),
                              ])
                            } else {
                              const pendingIds = pendingCalls.map((c) => c.id)
                              setSelectedCalls(
                                selectedCalls.filter((id) => !pendingIds.includes(id))
                              )
                            }
                          }}
                        />
                      </div>
                    </TableHead>
                    <TableHead className="w-[180px]">Recipient</TableHead>
                    <TableHead className="w-[180px]">Phone Number</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="w-[120px]">Call ID</TableHead>
                    <TableHead className="w-[100px]">Duration</TableHead>
                    <TableHead className="w-[180px]">Time Stamp</TableHead>
                    <TableHead className="w-[140px]">Status</TableHead>
                    <TableHead className="w-[100px] text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedCalls.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                        No calls found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selectedCalls.includes(call.id)}
                              disabled={call.status === "completed" || call.status === "canceled" || call.status === "missed"}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCalls([...selectedCalls, call.id])
                                } else {
                                  setSelectedCalls(
                                    selectedCalls.filter((id) => id !== call.id)
                                  )
                                }
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{call.recipientName}</TableCell>
                        <TableCell className="font-mono">{call.phoneNumber}</TableCell>
                        <TableCell className="text-muted-foreground max-w-[250px] truncate">
                          {call.notes}
                        </TableCell>
                        <TableCell className="font-mono">{call.callId}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {call.duration || "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {call.timeStamp || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="gap-1.5 text-muted-foreground px-1.5">
                            {getCallStatusConfig(call.status).icon}
                            {getCallStatusConfig(call.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={call.status !== "completed"}
                              onClick={() => handleViewDetail(call)}
                              className={cn(
                                call.status !== "completed" && "opacity-50 cursor-not-allowed"
                              )}
                            >
                              View
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-muted-foreground text-sm">
                Showing {paginatedCalls.length > 0 ? currentPage * pageSize + 1 : 0} to{" "}
                {Math.min((currentPage + 1) * pageSize, filteredCalls.length)}{" "}
                of {filteredCalls.length} calls
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                  <Select
                    value={`${pageSize}`}
                    onValueChange={(value) => {
                      setPageSize(Number(value))
                      setCurrentPage(0)
                    }}
                  >
                    <SelectTrigger className="h-8 w-[70px]">
                      <SelectValue placeholder={pageSize} />
                    </SelectTrigger>
                    <SelectContent side="top">
                      {[5, 10, 20, 50].map((size) => (
                        <SelectItem key={size} value={`${size}`}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium whitespace-nowrap">
                    Page {currentPage + 1} of {totalPages || 1}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage >= totalPages - 1}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Cancel Calls</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel {selectedCalls.length} selected call(s)? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Close
            </Button>
            <Button variant="destructive-outline" onClick={handleCancelSelected}>
              Cancel Calls
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
            <DialogDescription>
              View detailed information about this call
            </DialogDescription>
          </DialogHeader>
          {selectedCall && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Call ID
                  </Label>
                  <p className="text-sm font-mono">{selectedCall.callId}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div>
                    <Badge variant="outline" className="gap-1.5 text-muted-foreground px-1.5">
                      {getCallStatusConfig(selectedCall.status).icon}
                      {getCallStatusConfig(selectedCall.status).label}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Recipient Name
                  </Label>
                  <p className="text-sm">{selectedCall.recipientName}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </Label>
                  <p className="text-sm font-mono">{selectedCall.phoneNumber}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Duration
                  </Label>
                  <p className="text-sm">{selectedCall.duration || "-"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Time Stamp
                  </Label>
                  <p className="text-sm">{selectedCall.timeStamp || "-"}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                <p className="text-sm">{selectedCall.notes}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Campaign Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>Are you sure you want to delete this campaign?</p>
              <p className="font-medium text-foreground">This action will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Delete all pending and canceled calls</li>
                <li>Keep completed and missed calls in call logs for future reference</li>
              </ul>
              <p className="text-red-600 font-medium">This action cannot be undone.</p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive-outline" 
              onClick={() => {
                handleDeleteCampaign()
                setIsDeleteDialogOpen(false)
              }}
            >
              <Trash2 className="h-4 w-4" />
              Delete Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
