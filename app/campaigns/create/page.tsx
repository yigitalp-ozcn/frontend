"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dropzone, FileWithPreview } from "@/components/ui/dropzone"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
import { Check, ChevronRight, ChevronDownIcon, Search, Trash2, CalendarIcon, Clock, ChevronLeft, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface Recipient {
  id: string
  name: string
  phone_number: string
  notes: string
  status: "ready" | "error"
}

export default function CreateCampaignPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  
  // Expand/collapse states for summary
  const [expandedFields, setExpandedFields] = useState<{
    firstSentence: boolean
    taskPrompt: boolean
    postCallSummary: boolean
  }>({
    firstSentence: false,
    taskPrompt: false,
    postCallSummary: false,
  })
  
  // Step 1 - Basic Configuration
  const [batchName, setBatchName] = useState("")
  const [csvFile, setCsvFile] = useState<File | null>(null)
  
  // Mock recipients data
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "1", name: "John Doe", phone_number: "+1 (555) 123-4567", notes: "Preferred contact time: 9 AM - 12 PM", status: "ready" },
    { id: "2", name: "Jane Smith", phone_number: "+1 (555) 234-5678", notes: "Leave voicemail if no answer", status: "ready" },
    { id: "3", name: "Mike Johnson", phone_number: "+1 (555) 345-6789", notes: "Customer since 2020, interested in premium services", status: "error" },
    { id: "4", name: "Sarah Williams", phone_number: "+1 (555) 456-7890", notes: "Do not call before 2 PM", status: "ready" },
    { id: "5", name: "David Brown", phone_number: "+1 (555) 567-8901", notes: "VIP client, priority follow-up required", status: "ready" },
  ])
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "ready" | "error">("all")
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  
  // Schedule settings (in Step 1)
  const [startDate, setStartDate] = useState<Date>()
  const [startTime, setStartTime] = useState("10:30")
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  
  // Call time range
  const [callStartTime, setCallStartTime] = useState("09:00")
  const [callEndTime, setCallEndTime] = useState("17:00")
  
  // Step 2 - Call Configuration
  const [selectedAgent, setSelectedAgent] = useState("")
  const [selectedPathway, setSelectedPathway] = useState("")
  const [firstSentence, setFirstSentence] = useState("")
  const [taskPrompt, setTaskPrompt] = useState("")
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [postCallSummary, setPostCallSummary] = useState("")
  
  // Mock data
  const agents = [
    { id: "1", name: "Sales Agent" },
    { id: "2", name: "Support Agent" },
    { id: "3", name: "Survey Agent" },
  ]
  
  const pathways = [
    { id: "1", name: "Standard Call Flow" },
    { id: "2", name: "Quick Survey" },
    { id: "3", name: "Appointment Booking" },
  ]
  
  const availableTools = [
    { id: "calendar", name: "Calendar Booking" },
    { id: "crm", name: "CRM Integration" },
    { id: "email", name: "Email Sender" },
    { id: "sms", name: "SMS Notification" },
  ]
  
  // Filtered recipients based on search and status
  const filteredRecipients = recipients.filter(recipient => {
    const matchesSearch = 
      recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipient.phone_number.includes(searchQuery) ||
      recipient.notes.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || recipient.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  // Paginated recipients
  const paginatedRecipients = filteredRecipients.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  )
  
  const totalPages = Math.ceil(filteredRecipients.length / pageSize)
  
  const handleDeleteSelected = () => {
    setRecipients(recipients.filter(r => !selectedRecipients.includes(r.id)))
    setSelectedRecipients([])
  }
  
  const handleCsvUpload = (files: FileWithPreview[]) => {
    if (files.length === 0) return
    setCsvFile(files[0])
    // Here you would parse the CSV and add to recipients
  }

  const steps = [
    { id: 1, name: "Campaign Configuration", description: "Setup batch, recipients and schedule" },
    { id: 2, name: "Call Configuration", description: "Configure call settings" },
    { id: 3, name: "Review & Launch", description: "Review and launch campaign" },
  ]

  const canProceedFromStep1 = 
    batchName.trim() !== "" && 
    recipients.length > 0
  
  const canProceedFromStep2 = 
    selectedAgent !== "" &&
    firstSentence.trim() !== "" &&
    taskPrompt.trim() !== ""
  
  const canProceedFromStep3 = true

  const handleNext = () => {
    if (currentStep === 1 && canProceedFromStep1) {
      setCurrentStep(2)
    } else if (currentStep === 2 && canProceedFromStep2) {
      setCurrentStep(3)
    } else if (currentStep === 3) {
      // Create campaign
      console.log("Creating campaign:", { 
        batchName, 
        recipients, 
        startDate, 
        startTime, 
        callStartTime, 
        callEndTime,
        selectedAgent,
        selectedPathway,
        firstSentence,
        taskPrompt,
        selectedTools,
        postCallSummary
      })
      router.push("/campaigns")
    }
  }

  const handleBack = () => {
    if (currentStep === 1) {
      setShowCancelDialog(true)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }
  
  const handleCancelConfirm = () => {
    router.push("/campaigns")
  }
  
  const handleSaveDraft = () => {
    console.log("Saving draft:", {
      batchName,
      recipients,
      startDate,
      startTime,
      callStartTime,
      callEndTime,
      selectedAgent,
      selectedPathway,
      firstSentence,
      taskPrompt,
      selectedTools,
      postCallSummary
    })
    // Here you would save the draft to your backend
    router.push("/campaigns")
  }
  
  const toggleExpand = (field: 'firstSentence' | 'taskPrompt' | 'postCallSummary') => {
    setExpandedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Create Campaign">
        <Button variant="outline" onClick={handleSaveDraft}>
          Save Draft
        </Button>
      </PageHeader>
      
      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Changes?</AlertDialogTitle>
            <AlertDialogDescription>
              If you go back now, all your unsaved changes will be lost. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Editing</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        <div className="p-6 space-y-6">
          {/* Stepper - Full Width */}
          <div className="w-full">
            <div className="flex items-start w-full gap-0">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center" style={{ flex: index === steps.length - 1 ? '0 0 auto' : '1 1 0%' }}>
                  {/* Step Content - Horizontal */}
                  <div className="flex items-start gap-3">
                    {/* Step Circle */}
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-colors",
                        currentStep > step.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : currentStep === step.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/25 bg-background text-muted-foreground"
                      )}
                    >
                      {currentStep > step.id ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.id
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="pt-1">
                      <div
                        className={cn(
                          "text-sm font-semibold mb-1 whitespace-nowrap",
                          currentStep >= step.id
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.name}
                      </div>
                      <div className="text-xs text-muted-foreground whitespace-nowrap">
                        {step.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator />

          {/* Step Content */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* Batch Name */}
                <div className="space-y-2">
                  <Label htmlFor="batch-name">Batch Name</Label>
                  <Input
                    id="batch-name"
                    placeholder="e.g., Q1 Outreach Campaign"
                    value={batchName}
                    onChange={(e) => setBatchName(e.target.value)}
                  />
                </div>

                {/* Start Date and Time */}
                <div className="space-y-2">
                  <Label>Start Date and Time</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Campaign start date and time. If not set, it will start at the next available time.
                  </p>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-3">
                      <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            id="date-picker"
                            className="w-40 justify-start font-normal gap-2"
                          >
                            <CalendarIcon className="h-4 w-4" />
                            {startDate ? startDate.toLocaleDateString() : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              setStartDate(date)
                              setDatePickerOpen(false)
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="time"
                          id="time-picker"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="bg-background w-40 pl-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call Time Range */}
                <div className="space-y-2">
                  <Label>Call Time Range</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Time window during which calls will be made
                  </p>
                  <div className="flex gap-4">
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="time"
                          id="call-start-time"
                          value={callStartTime}
                          onChange={(e) => setCallStartTime(e.target.value)}
                          className="bg-background w-40 pl-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="time"
                          id="call-end-time"
                          value={callEndTime}
                          onChange={(e) => setCallEndTime(e.target.value)}
                          className="bg-background w-40 pl-10 appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upload Recipients */}
                <div className="space-y-2">
                  <Label>Upload Recipients (CSV)</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload a CSV file with the recipients you&apos;d like to call. A <code className="text-xs bg-muted px-1 py-0.5 rounded">phone_number</code> column is required.
                  </p>
                  <Dropzone
                    onDrop={handleCsvUpload}
                    accept={{ "text/csv": [".csv"] }}
                    maxFiles={1}
                    showPreview={true}
                  />
                </div>

                {/* Recipients Table */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Recipients ({recipients.length})</Label>
                    {selectedRecipients.length > 0 && (
                      <Button
                        variant="destructive-outline"
                        size="sm"
                        onClick={handleDeleteSelected}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Selected ({selectedRecipients.length})
                      </Button>
                    )}
                  </div>
                  
                  {/* Search Bar and Status Filter */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search recipients..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value)
                          setCurrentPage(0)
                        }}
                        className="pl-9"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={(value: "all" | "ready" | "error") => {
                      setStatusFilter(value)
                      setCurrentPage(0)
                    }}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="w-[50px]">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                checked={filteredRecipients.length > 0 && filteredRecipients.every(r => selectedRecipients.includes(r.id))}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    const allIds = filteredRecipients.map(r => r.id)
                                    setSelectedRecipients([...new Set([...selectedRecipients, ...allIds])])
                                  } else {
                                    const filteredIds = filteredRecipients.map(r => r.id)
                                    setSelectedRecipients(selectedRecipients.filter(id => !filteredIds.includes(id)))
                                  }
                                }}
                              />
                            </div>
                          </TableHead>
                          <TableHead className="w-[180px]">Name</TableHead>
                          <TableHead className="w-[180px]">Phone Number</TableHead>
                          <TableHead>Notes</TableHead>
                          <TableHead className="w-[140px] text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedRecipients.map((recipient) => (
                          <TableRow key={recipient.id}>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={selectedRecipients.includes(recipient.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedRecipients([...selectedRecipients, recipient.id])
                                    } else {
                                      setSelectedRecipients(selectedRecipients.filter(id => id !== recipient.id))
                                    }
                                  }}
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{recipient.name}</TableCell>
                            <TableCell className="text-muted-foreground">{recipient.phone_number}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{recipient.notes}</TableCell>
                            <TableCell>
                              <div className="flex justify-center">
                                <Badge 
                                  variant="outline" 
                                  className={
                                    recipient.status === "ready" 
                                      ? "text-green-600 dark:text-green-400 border-green-500/50"
                                      : "text-red-600 dark:text-red-400 border-red-500/50"
                                  }
                                >
                                  {recipient.status.charAt(0).toUpperCase() + recipient.status.slice(1)}
                                </Badge>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {/* Pagination */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-muted-foreground text-sm">
                      Showing {paginatedRecipients.length > 0 ? currentPage * pageSize + 1 : 0} to{" "}
                      {Math.min((currentPage + 1) * pageSize, filteredRecipients.length)}{" "}
                      of {filteredRecipients.length} recipients
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
              </>
            )}

            {currentStep === 2 && (
              <>
                {/* Agent Selection */}
                <div className="space-y-2">
                  <Label htmlFor="agent-select">
                    Agent Selection <span className="text-destructive">*</span>
                  </Label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger id="agent-select">
                      <SelectValue placeholder="Select an agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Choose the AI agent that will handle the calls
                  </p>
                </div>

                {/* Pathway Selection */}
                <div className="space-y-2">
                  <Label htmlFor="pathway-select">Pathway Selection</Label>
                  <Select value={selectedPathway} onValueChange={setSelectedPathway}>
                    <SelectTrigger id="pathway-select">
                      <SelectValue placeholder="Select a pathway (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {pathways.map((pathway) => (
                        <SelectItem key={pathway.id} value={pathway.id}>
                          {pathway.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Define the conversation flow for the agent
                  </p>
                </div>

                {/* First Sentence */}
                <div className="space-y-2">
                  <Label htmlFor="first-sentence">
                    First Sentence <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="first-sentence"
                    placeholder="e.g., Hello! This is calling from [Company Name]. How are you today?"
                    value={firstSentence}
                    onChange={(e) => setFirstSentence(e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    The opening statement the agent will use to start the conversation
                  </p>
                </div>

                {/* Task Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="task-prompt">
                    Task Prompt <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="task-prompt"
                    placeholder="e.g., Your task is to schedule an appointment with the customer. Be polite and professional..."
                    value={taskPrompt}
                    onChange={(e) => setTaskPrompt(e.target.value)}
                    rows={5}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Clear instructions for what the agent should accomplish during the call
                  </p>
                </div>

                {/* Tools */}
                <div className="space-y-2">
                  <Label>Tools</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Select tools the agent can use during the call
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 rounded-lg border p-4">
                    {availableTools.map((tool) => (
                      <div key={tool.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={tool.id}
                          checked={selectedTools.includes(tool.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedTools([...selectedTools, tool.id])
                            } else {
                              setSelectedTools(selectedTools.filter(t => t !== tool.id))
                            }
                          }}
                        />
                        <Label
                          htmlFor={tool.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {tool.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {selectedTools.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTools.map((toolId) => {
                        const tool = availableTools.find(t => t.id === toolId)
                        return (
                          <Badge key={toolId} variant="secondary" className="gap-1">
                            {tool?.name}
                          </Badge>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Post Call Summary Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="post-call-summary">Post Call Summary Prompt</Label>
                  <Textarea
                    id="post-call-summary"
                    placeholder="e.g., Summarize the call outcome, mention if appointment was scheduled, and note any follow-up actions..."
                    value={postCallSummary}
                    onChange={(e) => setPostCallSummary(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Instructions for generating a summary after each call completes
                  </p>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg border p-6 space-y-4">
                  <h3 className="text-lg font-semibold">Campaign Summary</h3>
                  
                  <div className="space-y-3">
                    {/* Campaign Configuration */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">Campaign Configuration</h4>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Batch Name</span>
                        <span className="text-sm font-medium">{batchName}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Recipients</span>
                        <span className="text-sm font-medium">{recipients.length} contacts</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Start Date</span>
                        <span className="text-sm font-medium">
                          {startDate ? new Date(startDate).toLocaleDateString() : 'Not set'}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Call Time Range</span>
                        <span className="text-sm font-medium">
                          {callStartTime && callEndTime ? `${callStartTime} - ${callEndTime}` : '-'}
                        </span>
                      </div>
                    </div>

                    {/* Call Configuration */}
                    <div className="space-y-2 pt-4 overflow-hidden">
                      <h4 className="text-sm font-semibold text-foreground">Call Configuration</h4>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Agent</span>
                        <span className="text-sm font-medium">
                          {agents.find(a => a.id === selectedAgent)?.name || '-'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-muted-foreground">Pathway</span>
                        <span className="text-sm font-medium">
                          {selectedPathway ? pathways.find(p => p.id === selectedPathway)?.name : 'Not set'}
                        </span>
                      </div>
                      
                      {/* First Sentence - Expandable */}
                      <div className="border-b overflow-hidden">
                        <div className="py-2">
                          {!expandedFields.firstSentence ? (
                            // Collapsed: Horizontal layout
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-sm text-muted-foreground flex-shrink-0">First Sentence</span>
                              <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                                <p className="text-sm font-medium text-right truncate">
                                  {firstSentence && firstSentence.length > 60 
                                    ? `${firstSentence.slice(0, 60)}...` 
                                    : (firstSentence || '-')
                                  }
                                </p>
                                {firstSentence && firstSentence.length > 60 && (
                                  <button
                                    onClick={() => toggleExpand('firstSentence')}
                                    className="text-primary hover:text-primary/80 flex-shrink-0 ml-2"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            // Expanded: Vertical layout
                            <div className="space-y-2 w-full">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-sm text-muted-foreground flex-shrink-0">First Sentence</span>
                                <button
                                  onClick={() => toggleExpand('firstSentence')}
                                  className="text-primary hover:text-primary/80 flex-shrink-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="w-full overflow-hidden">
                                <p className="text-sm font-medium whitespace-pre-wrap break-words">
                                  {firstSentence || '-'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Task Prompt - Expandable */}
                      <div className="border-b overflow-hidden">
                        <div className="py-2">
                          {!expandedFields.taskPrompt ? (
                            // Collapsed: Horizontal layout
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-sm text-muted-foreground flex-shrink-0">Task Prompt</span>
                              <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                                <p className="text-sm font-medium text-right truncate">
                                  {taskPrompt && taskPrompt.length > 60 
                                    ? `${taskPrompt.slice(0, 60)}...` 
                                    : (taskPrompt || '-')
                                  }
                                </p>
                                {taskPrompt && taskPrompt.length > 60 && (
                                  <button
                                    onClick={() => toggleExpand('taskPrompt')}
                                    className="text-primary hover:text-primary/80 flex-shrink-0 ml-2"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            // Expanded: Vertical layout
                            <div className="space-y-2 w-full">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-sm text-muted-foreground flex-shrink-0">Task Prompt</span>
                                <button
                                  onClick={() => toggleExpand('taskPrompt')}
                                  className="text-primary hover:text-primary/80 flex-shrink-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="w-full overflow-hidden">
                                <p className="text-sm font-medium whitespace-pre-wrap break-words">
                                  {taskPrompt || '-'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Tools */}
                      <div className="flex justify-between items-start py-2 border-b gap-4">
                        <span className="text-sm text-muted-foreground flex-shrink-0">Tools</span>
                        <div className="flex-1 flex justify-end">
                          {selectedTools.length > 0 ? (
                            <div className="flex flex-wrap gap-2 justify-end">
                              {selectedTools.map((toolId) => {
                                const tool = availableTools.find(t => t.id === toolId)
                                return (
                                  <Badge key={toolId} variant="secondary">
                                    {tool?.name}
                                  </Badge>
                                )
                              })}
                            </div>
                          ) : (
                            <span className="text-sm font-medium">None</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Post Call Summary Prompt - Expandable */}
                      <div className="border-b overflow-hidden">
                        <div className="py-2">
                          {!expandedFields.postCallSummary ? (
                            // Collapsed: Horizontal layout
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-sm text-muted-foreground flex-shrink-0">Post Call Summary</span>
                              <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
                                <p className="text-sm font-medium text-right truncate">
                                  {postCallSummary && postCallSummary.length > 60 
                                    ? `${postCallSummary.slice(0, 60)}...` 
                                    : (postCallSummary || 'Not set')
                                  }
                                </p>
                                {postCallSummary && postCallSummary.length > 60 && (
                                  <button
                                    onClick={() => toggleExpand('postCallSummary')}
                                    className="text-primary hover:text-primary/80 flex-shrink-0 ml-2"
                                  >
                                    <ChevronDown className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>
                          ) : (
                            // Expanded: Vertical layout
                            <div className="space-y-2 w-full">
                              <div className="flex justify-between items-center gap-2">
                                <span className="text-sm text-muted-foreground flex-shrink-0">Post Call Summary</span>
                                <button
                                  onClick={() => toggleExpand('postCallSummary')}
                                  className="text-primary hover:text-primary/80 flex-shrink-0"
                                >
                                  <ChevronUp className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="w-full overflow-hidden">
                                <p className="text-sm font-medium whitespace-pre-wrap break-words">
                                  {postCallSummary || 'Not set'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">
                    Review your campaign details above. Click &quot;Create Campaign&quot; to launch your campaign.
                  </p>
                </div>
              </div>
            )}
          </div>


          {/* Navigation Buttons */}
          <div className="flex justify-between pt-2">
            <Button
              variant="outline"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedFromStep1) ||
                (currentStep === 2 && !canProceedFromStep2)
              }
              className="gap-2"
            >
              {currentStep === 3 ? "Create Campaign" : "Next"}
              {currentStep < 3 && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


