"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Bot, ArrowUpRightIcon, Plus, Trash2, Settings, PhoneCall, FileText, Wrench, GitBranch } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Area, AreaChart, XAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Mock data for agents
type Agent = {
  id: string
  name: string
  description: string
  callCount: number
  successRate: number
  createdAt: string
  status: "active" | "inactive"
  type: string
  documents: number
  tools: number
  conversationalPaths: number
  phoneNumber: string
  callerType: "inbound" | "outbound"
  callActivity: { date: string; calls: number }[]
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Agent",
    description: "Handles customer inquiries and support requests with empathy and efficiency.",
    callCount: 1247,
    successRate: 94,
    createdAt: "2024-10-21",
    status: "active",
    type: "Inbound Support",
    documents: 24,
    tools: 5,
    conversationalPaths: 8,
    phoneNumber: "+1 (555) 123-4567",
    callerType: "inbound",
    callActivity: [
      { date: "Mon", calls: 45 },
      { date: "Tue", calls: 52 },
      { date: "Wed", calls: 38 },
      { date: "Thu", calls: 61 },
      { date: "Fri", calls: 48 },
      { date: "Sat", calls: 25 },
      { date: "Sun", calls: 18 },
    ],
  },
  {
    id: "2",
    name: "Sales Outreach Agent",
    description: "Proactive sales calls to potential customers with personalized pitches.",
    callCount: 856,
    successRate: 87,
    createdAt: "2024-09-15",
    status: "active",
    type: "Outbound Sales",
    documents: 12,
    tools: 3,
    conversationalPaths: 4,
    phoneNumber: "+1 (555) 987-6543",
    callerType: "outbound",
    callActivity: [
      { date: "Mon", calls: 32 },
      { date: "Tue", calls: 28 },
      { date: "Wed", calls: 35 },
      { date: "Thu", calls: 42 },
      { date: "Fri", calls: 38 },
      { date: "Sat", calls: 15 },
      { date: "Sun", calls: 8 },
    ],
  },
  {
    id: "3",
    name: "Appointment Scheduler",
    description: "Schedules and confirms appointments with customers efficiently.",
    callCount: 532,
    successRate: 91,
    createdAt: "2024-08-28",
    status: "active",
    type: "Inbound Scheduling",
    documents: 8,
    tools: 4,
    conversationalPaths: 3,
    phoneNumber: "+1 (555) 456-7890",
    callerType: "inbound",
    callActivity: [
      { date: "Mon", calls: 18 },
      { date: "Tue", calls: 22 },
      { date: "Wed", calls: 25 },
      { date: "Thu", calls: 28 },
      { date: "Fri", calls: 20 },
      { date: "Sat", calls: 12 },
      { date: "Sun", calls: 8 },
    ],
  },
  {
    id: "4",
    name: "Lead Qualification Agent",
    description: "Qualifies leads through intelligent conversations and data collection.",
    callCount: 0,
    successRate: 0,
    createdAt: "2024-11-10",
    status: "inactive",
    type: "Outbound Qualification",
    documents: 0,
    tools: 0,
    conversationalPaths: 0,
    phoneNumber: "Not assigned",
    callerType: "outbound",
    callActivity: [
      { date: "Mon", calls: 0 },
      { date: "Tue", calls: 0 },
      { date: "Wed", calls: 0 },
      { date: "Thu", calls: 0 },
      { date: "Fri", calls: 0 },
      { date: "Sat", calls: 0 },
      { date: "Sun", calls: 0 },
    ],
  },
]

const getStatusConfig = (status: Agent["status"]) => {
  switch (status) {
    case "active":
      return {
        label: "Active",
        color: "border-green-500 text-green-500",
        dotColor: "bg-green-500",
      }
    case "inactive":
      return {
        label: "Inactive",
        color: "border-red-500 text-red-500",
        dotColor: "bg-red-500",
      }
  }
}

const getCallerTypeConfig = (callerType: Agent["callerType"]) => {
  switch (callerType) {
    case "inbound":
      return {
        label: "Inbound",
        color: "border-blue-500 text-blue-500",
      }
    case "outbound":
      return {
        label: "Outbound",
        color: "border-purple-500 text-purple-500",
      }
  }
}

const getTimeAgo = (date: string) => {
  const now = new Date()
  const createdDate = new Date(date)
  const diffTime = Math.abs(now.getTime() - createdDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 30) return `${diffDays} days ago`
  if (diffDays < 60) return "1 month ago"
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`
}

// Country codes data
const countryCodes = [
  { code: "+1", country: "US/CA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+90", country: "TR", flag: "🇹🇷" },
  { code: "+49", country: "DE", flag: "🇩🇪" },
  { code: "+33", country: "FR", flag: "🇫🇷" },
  { code: "+39", country: "IT", flag: "🇮🇹" },
  { code: "+34", country: "ES", flag: "🇪🇸" },
  { code: "+91", country: "IN", flag: "🇮🇳" },
  { code: "+86", country: "CN", flag: "🇨🇳" },
  { code: "+81", country: "JP", flag: "🇯🇵" },
]

export default function Page() {
  const router = useRouter()
  // Change this to true to see the agents list
  const [hasAgents, setHasAgents] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isTestCallDialogOpen, setIsTestCallDialogOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1")
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleCreate = () => {
    // Here you would implement the actual create logic
    console.log("Creating agent:", {
      name: agentName,
      description: agentDescription,
    })
    // Close dialog after creation
    setIsCreateDialogOpen(false)
    setAgentName("")
    setAgentDescription("")
  }

  const handleDeleteClick = (id: string) => {
    setSelectedAgentId(id)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    // Here you would implement the actual delete logic
    console.log("Deleting agent:", selectedAgentId)
    // Close dialog after deletion
    setIsDeleteDialogOpen(false)
    setSelectedAgentId(null)
  }

  const handleTestCallClick = (id: string) => {
    setSelectedAgentId(id)
    setIsTestCallDialogOpen(true)
  }

  const handleTestCallConfirm = () => {
    // Here you would implement the actual test call logic
    console.log("Test call:", {
      agentId: selectedAgentId,
      phone: selectedCountryCode + phoneNumber,
    })
    // Close dialog after test call
    setIsTestCallDialogOpen(false)
    setSelectedAgentId(null)
    setPhoneNumber("")
    setSelectedCountryCode("+1")
  }

  const selectedAgent = mockAgents.find((agent) => agent.id === selectedAgentId)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Agents">
        {hasAgents && (
          <Button
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Create Agent
          </Button>
        )}
      </PageHeader>

      {/* Create Agent Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Agent</DialogTitle>
            <DialogDescription>
              Create a new AI agent to handle your calls
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Agent Name */}
            <div className="space-y-2">
              <Label htmlFor="create-agent-name">
                Agent Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-agent-name"
                placeholder="Enter agent name"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                maxLength={30}
                required
              />
              <p className="text-xs text-muted-foreground">
                {agentName.length}/30 characters
              </p>
            </div>

            {/* Agent Description */}
            <div className="space-y-2">
              <Label htmlFor="create-agent-description">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="create-agent-description"
                placeholder="Enter a description for this agent"
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                maxLength={100}
                rows={3}
                required
              />
              <p className="text-xs text-muted-foreground">
                {agentDescription.length}/100 characters
              </p>
            </div>

            {/* Agent Info */}
            <div className="rounded-lg border border-muted bg-muted/30 p-4 space-y-2">
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-muted p-1 mt-0.5">
                  <svg
                    className="h-4 w-4 text-muted-foreground"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 space-y-1 text-sm">
                  <p className="font-medium text-foreground">What&apos;s Next?</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Configure voice and language settings</li>
                    <li>• Set up knowledge base for the agent</li>
                    <li>• Add custom tools and integrations</li>
                    <li>• Test the agent before going live</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setAgentName("")
                setAgentDescription("")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!agentName.trim() || !agentDescription.trim()}
            >
              Create Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Agent</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this agent? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive-outline"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Call Dialog */}
      <Dialog open={isTestCallDialogOpen} onOpenChange={setIsTestCallDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Test Call</DialogTitle>
            <DialogDescription>
              Make a test call to verify your agent&apos;s configuration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Agent Selection (Disabled) */}
            <div className="space-y-2">
              <Label htmlFor="test-agent">Agent</Label>
              <Select value={selectedAgentId || ""} disabled>
                <SelectTrigger id="test-agent">
                  <SelectValue placeholder="Select agent">
                    {selectedAgent?.name}
                  </SelectValue>
                </SelectTrigger>
              </Select>
            </div>

            {/* Phone Number Input with Country Code */}
            <div className="space-y-2">
              <Label htmlFor="test-phone">Phone Number <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                {/* Country Code Selector */}
                <Select value={selectedCountryCode} onValueChange={setSelectedCountryCode}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span>{country.code}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Phone Number Input */}
                <Input
                  id="test-phone"
                  type="tel"
                  placeholder="555 123 4567"
                  value={phoneNumber}
                  onChange={(e) => {
                    // Only allow numbers and spaces
                    const value = e.target.value.replace(/[^\d\s]/g, "")
                    setPhoneNumber(value)
                  }}
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Enter the phone number you want to call for testing
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsTestCallDialogOpen(false)
                setPhoneNumber("")
                setSelectedCountryCode("+1")
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTestCallConfirm}
              disabled={!phoneNumber.trim()}
            >
              <PhoneCall className="h-4 w-4" />
              Start Test Call
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        {!hasAgents ? (
          <div className="flex items-center justify-center min-h-[500px] p-4">
            <Empty className="border border-dashed max-w-2xl">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Bot />
                </EmptyMedia>
                <EmptyTitle>No Agents Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any AI agents yet. Get started by creating
                  your first agent to handle calls.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4" />
                  Create Your First Agent
                </Button>
              </EmptyContent>
              <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
              >
                <a href="#">
                  Learn More <ArrowUpRightIcon />
                </a>
              </Button>
            </Empty>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {mockAgents.map((agent) => (
                <Card key={agent.id} className="flex flex-col">
                  {/* Header with title and status badge */}
                  <CardHeader>
                    <div className="flex items-center justify-between w-full mb-[-10px]">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{agent.type}</p>
                      </div>
                      <Badge variant="outline" className={`gap-1.5 shrink-0 ${getStatusConfig(agent.status).color}`}>
                        <span className={`h-2 w-2 rounded-full ${getStatusConfig(agent.status).dotColor}`}></span>
                        {getStatusConfig(agent.status).label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <Separator />

                  {/* Content information */}
                  <CardContent className="space-y-3 flex-1">
                    {/* Stats Grid */}
                    <div className="flex items-center justify-between gap-2 text-sm flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{agent.callCount}</span>
                        <span className="text-muted-foreground">Calls</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{agent.documents}</span>
                        <span className="text-muted-foreground">Docs</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{agent.tools}</span>
                        <span className="text-muted-foreground">Tools</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{agent.conversationalPaths}</span>
                        <span className="text-muted-foreground">Paths</span>
                      </div>
                    </div>

                    {/* Phone and Caller Type */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Phone Number</span>
                        <span className="font-medium">{agent.phoneNumber}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Caller Type</span>
                        <Badge variant="outline" className={getCallerTypeConfig(agent.callerType).color}>
                          {getCallerTypeConfig(agent.callerType).label}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created</span>
                        <span className="font-medium">{new Date(agent.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Call Activity Chart */}
                    <div className="space-y-1.5">
                      <span className="text-sm font-medium">Call Activity</span>
                      <ChartContainer
                        config={{
                          calls: {
                            label: "Calls",
                            color: "hsl(142, 76%, 36%)",
                          },
                        }}
                        className="h-[100px] w-full"
                      >
                        <AreaChart data={agent.callActivity}>
                          <defs>
                            <linearGradient id={`gradient-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="date"
                            tick={false}
                            axisLine={false}
                          />
                          <Area
                            type="monotone"
                            dataKey="calls"
                            stroke="hsl(142, 76%, 36%)"
                            fill={`url(#gradient-${agent.id})`}
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ChartContainer>
                    </div>
                  </CardContent>

                  {/* Footer with action buttons */}
                  <CardFooter className="gap-2 mt-[-16px]">
                    <Button
                      variant="destructive-outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDeleteClick(agent.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => router.push(`/agents/${agent.id}`)}
                    >
                      <Settings className="h-4 w-4" />
                      Configure
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleTestCallClick(agent.id)}
                    >
                      <PhoneCall className="h-4 w-4" />
                      Test Call
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
        </div>
        )}
      </div>
    </div>
  )
}