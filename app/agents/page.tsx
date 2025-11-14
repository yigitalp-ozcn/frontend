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
import { Bot, ArrowUpRightIcon, Plus, Trash2, Settings, PhoneCall } from "lucide-react"
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
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Agent",
    description: "Handles customer inquiries and support requests with empathy and efficiency.",
    callCount: 1247,
    successRate: 94,
    createdAt: "2024-03-15",
    status: "active",
    type: "Inbound Support",
  },
  {
    id: "2",
    name: "Sales Outreach Agent",
    description: "Proactive sales calls to potential customers with personalized pitches.",
    callCount: 856,
    successRate: 87,
    createdAt: "2024-03-10",
    status: "active",
    type: "Outbound Sales",
  },
  {
    id: "3",
    name: "Appointment Scheduler",
    description: "Schedules and confirms appointments with customers efficiently.",
    callCount: 532,
    successRate: 91,
    createdAt: "2024-03-08",
    status: "active",
    type: "Inbound Scheduling",
  },
  {
    id: "4",
    name: "Lead Qualification Agent",
    description: "Qualifies leads through intelligent conversations and data collection.",
    callCount: 0,
    successRate: 0,
    createdAt: "2024-03-05",
    status: "inactive",
    type: "Outbound Qualification",
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

export default function Page() {
  const router = useRouter()
  // Change this to true to see the agents list
  const [hasAgents, setHasAgents] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [agentName, setAgentName] = useState("")
  const [agentDescription, setAgentDescription] = useState("")

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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {mockAgents.map((agent) => (
                <Card key={agent.id}>
                  {/* Row 1: Header with title and status badge */}
                  <CardHeader>
                    <div className="flex items-center justify-between w-full">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{agent.type}</p>
                      </div>
                      <Badge variant="outline" className={`gap-1.5 ${getStatusConfig(agent.status).color}`}>
                        <span className={`h-2 w-2 rounded-full ${getStatusConfig(agent.status).dotColor}`}></span>
                        {getStatusConfig(agent.status).label}
                      </Badge>
                    </div>
                  </CardHeader>

                  <Separator />

                  {/* Row 2: Content information */}
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                      <span className="text-muted-foreground">Created: {new Date(agent.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs">Total Calls</span>
                        <span className="font-semibold">{agent.callCount.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-muted-foreground text-xs">Success Rate</span>
                        <span className="font-semibold">{agent.successRate}%</span>
                      </div>
                    </div>
                  </CardContent>

                  {/* Row 3: Footer with action buttons */}
                  <CardFooter className="gap-2">
                    <Button
                      variant="destructive-outline"
                      className="flex-1"
                      onClick={() => handleDeleteClick(agent.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Sil
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => router.push(`/agents/${agent.id}`)}
                    >
                      <Settings className="h-4 w-4" />
                      Yapılandır
                    </Button>
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => console.log("Test call for agent:", agent.id)}
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