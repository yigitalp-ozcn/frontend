"use client"

import { useState, useMemo } from "react"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { Search, ArrowUpDown, Filter, X, Upload } from "lucide-react"
import { DataTable } from "@/components/call-table"
import { Badge } from "@/components/ui/badge"
import { CALL_TYPES, CALL_STATUSES, AGENT_OPTIONS, CAMPAIGN_OPTIONS } from "@/lib/constants"

// Mock data for call logs
const mockCallLogs = [
  {
    id: 1,
    callType: "Inbound",
    agent: "Agent 1",
    callId: "CALL-001",
    customer: "John Doe",
    phoneNumber: "+1 234 567 8901",
    timeStamp: "2024-01-12 10:30 AM",
    duration: "5m 23s",
    status: "Completed",
    campaign: "Summer Sale",
  },
  {
    id: 2,
    callType: "Outbound",
    agent: "Agent 2",
    callId: "CALL-002",
    customer: "Jane Smith",
    phoneNumber: "+1 234 567 8902",
    timeStamp: "2024-01-13 11:45 AM",
    duration: "3m 12s",
    status: "Completed",
    campaign: "Product Launch",
  },
  {
    id: 3,
    callType: "Inbound",
    agent: "Agent 1",
    callId: "CALL-003",
    customer: "Bob Johnson",
    phoneNumber: "+1 234 567 8903",
    timeStamp: "2024-01-14 02:15 PM",
    duration: "0m 00s",
    status: "Missed",
    campaign: "Customer Support",
  },
  {
    id: 4,
    callType: "Outbound",
    agent: "Agent 3",
    callId: "CALL-004",
    customer: "Alice Brown",
    phoneNumber: "+1 234 567 8904",
    timeStamp: "2024-01-15 03:30 PM",
    duration: "8m 45s",
    status: "Completed",
    campaign: "Summer Sale",
  },
  {
    id: 5,
    callType: "Inbound",
    agent: "Agent 2",
    callId: "CALL-005",
    customer: "Charlie Wilson",
    phoneNumber: "+1 234 567 8905",
    timeStamp: "2024-01-16 04:20 PM",
    duration: "2m 18s",
    status: "Failed",
    campaign: "Product Launch",
  },
  {
    id: 6,
    callType: "Inbound",
    agent: "Agent 1",
    callId: "CALL-006",
    customer: "David Lee",
    phoneNumber: "+1 234 567 8906",
    timeStamp: "2024-01-17 05:00 PM",
    duration: "In Progress",
    status: "In Progress",
    campaign: "Customer Support",
  },
]

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)
  
  // Filter states - başlangıçta boş
  const [selectedCallTypes, setSelectedCallTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([])

  // Report dialog states
  const [reportEmail, setReportEmail] = useState("")
  const [reportDateRange, setReportDateRange] = useState<DateRange | undefined>()
  const [reportCallTypes, setReportCallTypes] = useState<string[]>([])
  const [reportStatuses, setReportStatuses] = useState<string[]>([])
  const [reportAgents, setReportAgents] = useState<string[]>([])
  const [reportCampaigns, setReportCampaigns] = useState<string[]>([])

  // Generic toggle function for filters - consolidates 8 duplicate functions into one
  const createToggle = <T,>(setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    return (item: T) => {
      setter((prev) => prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item])
    }
  }

  const toggleReportCallType = createToggle(setReportCallTypes)
  const toggleReportStatus = createToggle(setReportStatuses)
  const toggleReportAgent = createToggle(setReportAgents)
  const toggleReportCampaign = createToggle(setReportCampaigns)
  const toggleCallType = createToggle(setSelectedCallTypes)
  const toggleStatus = createToggle(setSelectedStatuses)
  const toggleAgent = createToggle(setSelectedAgents)
  const toggleCampaign = createToggle(setSelectedCampaigns)

  const handleDownloadReport = () => {
    console.log("Downloading report...", {
      email: reportEmail,
      dateRange: reportDateRange,
      callTypes: reportCallTypes,
      statuses: reportStatuses,
      agents: reportAgents,
      campaigns: reportCampaigns,
    })
    // Here you would implement the actual report download logic
    setReportDialogOpen(false)
    // Reset form
    setReportEmail("")
    setReportDateRange(undefined)
    setReportCallTypes([])
    setReportStatuses([])
    setReportAgents([])
    setReportCampaigns([])
  }

  const clearAllFilters = () => {
    setSelectedCallTypes([])
    setSelectedStatuses([])
    setSelectedAgents([])
    setSelectedCampaigns([])
  }

  const getActiveFilterCount = () => {
    return selectedCallTypes.length + selectedStatuses.length + selectedAgents.length + selectedCampaigns.length
  }

  const getActiveFilterGroups = () => {
    const groups: Array<{ category: string; values: string[]; onClear: () => void }> = []
    
    if (selectedCallTypes.length > 0) {
      groups.push({
        category: "Call Types",
        values: selectedCallTypes,
        onClear: () => setSelectedCallTypes([])
      })
    }
    
    if (selectedStatuses.length > 0) {
      groups.push({
        category: "Statuses",
        values: selectedStatuses,
        onClear: () => setSelectedStatuses([])
      })
    }
    
    if (selectedAgents.length > 0) {
      groups.push({
        category: "Agents",
        values: selectedAgents,
        onClear: () => setSelectedAgents([])
      })
    }
    
    if (selectedCampaigns.length > 0) {
      groups.push({
        category: "Campaigns",
        values: selectedCampaigns,
        onClear: () => setSelectedCampaigns([])
      })
    }
    
    return groups
  }

  // Filter and search data
  const filteredData = useMemo(() => {
    let filtered = [...mockCallLogs]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((item) =>
        item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.callId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply call type filter - sadece seçilenleri göster
    if (selectedCallTypes.length > 0) {
      filtered = filtered.filter((item) => selectedCallTypes.includes(item.callType))
    }

    // Apply status filter - sadece seçilenleri göster
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((item) => selectedStatuses.includes(item.status))
    }

    // Apply agent filter - sadece seçilenleri göster
    if (selectedAgents.length > 0) {
      filtered = filtered.filter((item) => selectedAgents.includes(item.agent))
    }

    // Apply campaign filter - sadece seçilenleri göster
    if (selectedCampaigns.length > 0) {
      filtered = filtered.filter((item) => selectedCampaigns.includes(item.campaign))
    }

    // Apply sorting by timestamp
    filtered.sort((a, b) => {
      const dateA = new Date(a.timeStamp).getTime()
      const dateB = new Date(b.timeStamp).getTime()
      
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [searchQuery, selectedCallTypes, selectedStatuses, selectedAgents, selectedCampaigns, sortOrder])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Call Logs">
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4" />
              Export Logs
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Export Logs</DialogTitle>
              <DialogDescription>
                Configure export settings and provide an email address
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="report-email" className="text-sm font-medium">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="report-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={reportEmail}
                  onChange={(e) => setReportEmail(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Date Range Picker */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date Range</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between text-left font-normal"
                    >
                      <span className="text-sm">
                        {reportDateRange?.from ? (
                          reportDateRange.to ? (
                            <>
                              {format(reportDateRange.from, "dd/MM/yyyy")} -{" "}
                              {format(reportDateRange.to, "dd/MM/yyyy")}
                            </>
                          ) : (
                            format(reportDateRange.from, "dd/MM/yyyy")
                          )
                        ) : (
                          <span className="text-muted-foreground">Select date range</span>
                        )}
                      </span>
                      <CalendarIcon className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={reportDateRange?.from}
                      selected={reportDateRange}
                      onSelect={setReportDateRange}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Call Type Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Call Type</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">
                        {reportCallTypes.length === 0
                          ? "All call types"
                          : `Selected: ${reportCallTypes.join(", ")}`}
                      </span>
                      <Filter className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                    <div className="space-y-1">
                      {CALL_TYPES.map((type) => (
                        <div key={type} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer">
                          <Checkbox
                            id={`report-type-${type}`}
                            checked={reportCallTypes.includes(type)}
                            onCheckedChange={() => toggleReportCallType(type)}
                          />
                          <Label
                            htmlFor={`report-type-${type}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {type}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Call Status Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Call Status</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">
                        {reportStatuses.length === 0
                          ? "All statuses"
                          : `Selected: ${reportStatuses.join(", ")}`}
                      </span>
                      <Filter className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                    <div className="space-y-1">
                      {CALL_STATUSES.map((status) => (
                        <div key={status} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer">
                          <Checkbox
                            id={`report-status-${status}`}
                            checked={reportStatuses.includes(status)}
                            onCheckedChange={() => toggleReportStatus(status)}
                          />
                          <Label
                            htmlFor={`report-status-${status}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {status}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Agent Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Agent</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">
                        {reportAgents.length === 0
                          ? "All agents"
                          : `Selected: ${reportAgents.join(", ")}`}
                      </span>
                      <Filter className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                    <div className="space-y-1">
                      {AGENT_OPTIONS.map((agent) => (
                        <div key={agent} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer">
                          <Checkbox
                            id={`report-agent-${agent}`}
                            checked={reportAgents.includes(agent)}
                            onCheckedChange={() => toggleReportAgent(agent)}
                          />
                          <Label
                            htmlFor={`report-agent-${agent}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {agent}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Campaign Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Campaign</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">
                        {reportCampaigns.length === 0
                          ? "All campaigns"
                          : `Selected: ${reportCampaigns.join(", ")}`}
                      </span>
                      <Filter className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                    <div className="space-y-1">
                      {CAMPAIGN_OPTIONS.map((campaign) => (
                        <div key={campaign} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer">
                          <Checkbox
                            id={`report-campaign-${campaign}`}
                            checked={reportCampaigns.includes(campaign)}
                            onCheckedChange={() => toggleReportCampaign(campaign)}
                          />
                          <Label
                            htmlFor={`report-campaign-${campaign}`}
                            className="text-sm font-normal cursor-pointer flex-1"
                          >
                            {campaign}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setReportDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDownloadReport}
                disabled={!reportEmail || !reportEmail.includes("@")}
              >
                Export
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      {/* Search, Sort, Filter Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <DateRangePicker />

          <Dialog open={filterDialogOpen} onOpenChange={setFilterDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
                {getActiveFilterCount() > 0 && (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Filter Call Logs</DialogTitle>
                <DialogDescription>
                  Select filters to narrow down your call logs
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Call Type Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Call Type</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">
                        {selectedCallTypes.length === 0
                          ? "Select call types..."
                          : `Selected: ${selectedCallTypes.join(", ")}`}
                      </span>
                      <Filter className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                      <div className="space-y-1">
                        {CALL_TYPES.map((type) => (
                          <div key={type} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer">
                            <Checkbox
                              id={`dialog-type-${type}`}
                              checked={selectedCallTypes.includes(type)}
                              onCheckedChange={() => toggleCallType(type)}
                            />
                            <Label
                              htmlFor={`dialog-type-${type}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Call Status Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Call Status</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">
                        {selectedStatuses.length === 0
                          ? "Select statuses..."
                          : `Selected: ${selectedStatuses.join(", ")}`}
                      </span>
                      <Filter className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                      <div className="space-y-1">
                        {CALL_STATUSES.map((status) => (
                          <div key={status} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer">
                            <Checkbox
                              id={`dialog-status-${status}`}
                              checked={selectedStatuses.includes(status)}
                              onCheckedChange={() => toggleStatus(status)}
                            />
                            <Label
                              htmlFor={`dialog-status-${status}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {status}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Agent Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Agent</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">
                        {selectedAgents.length === 0
                          ? "Select agents..."
                          : `Selected: ${selectedAgents.join(", ")}`}
                      </span>
                      <Filter className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                      <div className="space-y-1">
                        {AGENT_OPTIONS.map((agent) => (
                          <div key={agent} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer">
                            <Checkbox
                              id={`dialog-agent-${agent}`}
                              checked={selectedAgents.includes(agent)}
                              onCheckedChange={() => toggleAgent(agent)}
                            />
                            <Label
                              htmlFor={`dialog-agent-${agent}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {agent}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Campaign Filter */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Campaign</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span className="text-sm">
                        {selectedCampaigns.length === 0
                          ? "Select campaigns..."
                          : `Selected: ${selectedCampaigns.join(", ")}`}
                      </span>
                      <Filter className="h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2" align="start">
                      <div className="space-y-1">
                        {CAMPAIGN_OPTIONS.map((campaign) => (
                          <div key={campaign} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-accent rounded-sm cursor-pointer">
                            <Checkbox
                              id={`dialog-campaign-${campaign}`}
                              checked={selectedCampaigns.includes(campaign)}
                              onCheckedChange={() => toggleCampaign(campaign)}
                            />
                            <Label
                              htmlFor={`dialog-campaign-${campaign}`}
                              className="text-sm font-normal cursor-pointer flex-1"
                            >
                              {campaign}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear All
                </Button>
                <Button onClick={() => setFilterDialogOpen(false)}>
                  Apply Filters
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="justify-start gap-2 w-auto">
                <ArrowUpDown className="h-4 w-4" />
                <span className="hidden sm:inline">{sortOrder === "newest" ? "Newest to Oldest" : "Oldest to Newest"}</span>
                <span className="sm:hidden">Sort</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-2" align="start">
              <div className="space-y-1">
                <Button
                  variant={sortOrder === "newest" ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8"
                  onClick={() => setSortOrder("newest")}
                >
                  Newest to Oldest
                </Button>
                <Button
                  variant={sortOrder === "oldest" ? "secondary" : "ghost"}
                  className="w-full justify-start font-normal text-sm h-8"
                  onClick={() => setSortOrder("oldest")}
                >
                  Oldest to Newest
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="relative ml-auto w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by customer, phone, or call ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
        </div>

        {/* Active Filters */}
        {getActiveFilterGroups().length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Showing:</span>
            {getActiveFilterGroups().map((group) => (
              <Badge
                key={group.category}
                variant="secondary"
                className="gap-1.5 pl-2.5 pr-1.5 py-1"
              >
                <span className="text-xs">
                  <span className="font-medium">{group.category}:</span>{" "}
                  {group.values.join(", ")}
                </span>
                <button
                  onClick={group.onClear}
                  className="ml-1 rounded-full hover:bg-muted-foreground/20 p-0.5"
                  aria-label={`Clear ${group.category} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {getActiveFilterGroups().length > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-7 text-xs"
              >
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>

      <DataTable data={filteredData} defaultPageSize={20} />
    </div>
  )
}
