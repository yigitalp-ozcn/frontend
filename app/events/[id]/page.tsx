"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChevronRight,
  Save,
  Trash2,
  Radio,
  Copy,
  Play,
  Code2,
  Loader2,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
} from "lucide-react"

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  // Event Settings State
  const [eventName, setEventName] = useState(
    eventId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  )
  const [eventDescription, setEventDescription] = useState("")
  const [isEnabled, setIsEnabled] = useState(true)
  
  // Call Configuration State
  const [selectedAgent, setSelectedAgent] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")
  
  // Test Event State
  const [isListenDialogOpen, setIsListenDialogOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [eventReceived, setEventReceived] = useState(false)

  // Mock trigger history data
  const triggerHistory = [
    {
      id: "1",
      triggeredAt: "2024-01-15 14:30:25",
      status: "success" as const,
      callId: "call_abc123",
      duration: "2m 45s",
    },
    {
      id: "2",
      triggeredAt: "2024-01-15 12:15:10",
      status: "success" as const,
      callId: "call_def456",
      duration: "1m 20s",
    },
    {
      id: "3",
      triggeredAt: "2024-01-15 10:05:33",
      status: "failed" as const,
      callId: "call_ghi789",
      duration: "-",
    },
    {
      id: "4",
      triggeredAt: "2024-01-14 16:45:12",
      status: "success" as const,
      callId: "call_jkl012",
      duration: "3m 10s",
    },
  ]

  const webhookUrl = `https://api.yourapp.com/events/${eventId}`

  const handleSaveSettings = () => {
    console.log("Saving event settings:", {
      eventName,
      eventDescription,
      isEnabled,
      selectedAgent,
      customPrompt,
    })
    // TODO: Implement save logic
  }

  // Mock agents data
  const agents = [
    { id: "agent-1", name: "Sales Assistant" },
    { id: "agent-2", name: "Customer Support" },
    { id: "agent-3", name: "Technical Support" },
    { id: "agent-4", name: "Appointment Scheduler" },
  ]

  const handleDeleteEvent = () => {
    if (confirm(`Are you sure you want to delete "${eventName}"?`)) {
      router.push("/events")
    }
  }

  const handleOpenListenDialog = () => {
    setIsListenDialogOpen(true)
    setIsListening(false)
    setEventReceived(false)
  }

  const handleStartListening = () => {
    setIsListening(true)
    setEventReceived(false)
    
    // Simulate listening for event
    setTimeout(() => {
      setEventReceived(true)
    }, 3000)
  }

  const handleCloseListenDialog = () => {
    setIsListenDialogOpen(false)
    setIsListening(false)
    setEventReceived(false)
  }

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl)
  }

  const handleCopyPayload = () => {
    const payload = JSON.stringify({
      event: eventId,
      timestamp: new Date().toISOString(),
      data: {
        transcript: "example text",
        callId: "call_123456",
        duration: 120,
        metadata: {}
      }
    }, null, 2)
    navigator.clipboard.writeText(payload)
  }

  const examplePayload = {
    event: eventId,
    timestamp: new Date().toISOString(),
    data: {
      transcript: "example text",
      callId: "call_123456",
      duration: 120,
      metadata: {}
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => router.push("/events")}
            >
              Events
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span>{eventName}</span>
          </div>
        }
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleDeleteEvent}>
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
          <Button size="sm" onClick={handleSaveSettings}>
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </PageHeader>

      {/* Listen Event Dialog */}
      <Dialog open={isListenDialogOpen} onOpenChange={setIsListenDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Listen for Event</DialogTitle>
            <DialogDescription>
              Test your event configuration by listening for incoming webhook calls
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-6">
            {!isListening && !eventReceived && (
              // Step 1: Show payload and start listening button
              <>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Send a POST request to the webhook URL below with the following payload structure. 
                    Once you click &quot;Start Listening&quot;, we&apos;ll wait for your event to arrive.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Webhook URL</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyWebhookUrl}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <code className="text-xs font-mono break-all">{webhookUrl}</code>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Expected Payload</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPayload}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="rounded-lg bg-muted p-4 overflow-x-auto text-xs max-h-[300px]">
                    <code>{JSON.stringify(examplePayload, null, 2)}</code>
                  </pre>
                </div>
              </>
            )}

            {(isListening || eventReceived) && (
              // Step 2: Show listening state or success
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                {!eventReceived ? (
                  <>
                    <div className="relative">
                      <Loader2 className="w-16 h-16 text-primary animate-spin" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold">Listening for events...</h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Waiting for a POST request to be sent to your webhook URL. 
                        Send the payload from your application or use a tool like cURL or Postman.
                      </p>
                    </div>
                    <div className="rounded-lg bg-muted p-3 mt-4">
                      <code className="text-xs font-mono break-all">{webhookUrl}</code>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <CheckCircle2 className="w-16 h-16 text-green-500" />
                    </div>
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
                        Event Received Successfully!
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        Your event configuration is working correctly. The webhook received the test event.
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 mt-4 w-full">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">
                            Event Details
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            Event ID: {eventId}
                          </p>
                          <p className="text-xs text-green-700 dark:text-green-300">
                            Received at: {new Date().toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            {!isListening && !eventReceived && (
              <>
                <Button
                  variant="outline"
                  onClick={handleCloseListenDialog}
                >
                  Cancel
                </Button>
                <Button onClick={handleStartListening}>
                  <Play className="w-4 h-4" />
                  Start Listening
                </Button>
              </>
            )}
            {eventReceived && (
              <Button onClick={handleCloseListenDialog}>
                Done
              </Button>
            )}
            {isListening && !eventReceived && (
              <Button
                variant="outline"
                onClick={handleCloseListenDialog}
              >
                Stop Listening
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 min-h-0">
        {/* Left Panel - Search Configuration */}
        <div className="flex-1 flex flex-col rounded-lg border bg-background shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-5 h-5" />
              <h2 className="text-xl font-semibold">Event Configuration</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Configure when this event should be triggered
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="event-name">
                  Event Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="event-name"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="Enter event name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="event-description">Description</Label>
                <Textarea
                  id="event-description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="Describe what this event does..."
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Event Status</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable this event trigger
                  </p>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={setIsEnabled}
                />
              </div>
            </div>

            <Separator />

            {/* Configure Call */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Configure Call</h3>
                <p className="text-xs text-muted-foreground">
                  Set up the agent and custom instructions for this event
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="select-agent">
                  Select Agent <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger id="select-agent">
                    <SelectValue placeholder="Choose an agent..." />
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
                  The agent that will handle calls triggered by this event
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Custom Prompt</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter custom instructions for the agent..."
                  className="min-h-[150px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Additional instructions or context that will be provided to the agent during the call
                </p>
              </div>
            </div>

            <Separator />

            {/* Trigger History */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">Trigger History</h3>
                <p className="text-xs text-muted-foreground">
                  Recent events that triggered this configuration
                </p>
              </div>

              <div className="space-y-2">
                {triggerHistory.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-6 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No triggers yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {triggerHistory.map((trigger) => (
                      <div
                        key={trigger.id}
                        className="rounded-lg border bg-background p-3 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {trigger.status === "success" ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-muted-foreground" />
                                <span className="text-xs font-mono text-muted-foreground truncate">
                                  {trigger.callId}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {trigger.triggeredAt}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-medium">
                              {trigger.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {triggerHistory.length > 0 && (
                <Button variant="outline" className="w-full" size="sm">
                  View All History
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - POST Info, Test & Code Preview */}
        <div className="w-full lg:w-[520px] flex flex-col rounded-lg border bg-background shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold mb-1">Event Endpoint</h3>
            <p className="text-sm text-muted-foreground">
              Test your event and view integration code
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Webhook URL */}
            <div className="space-y-3">
              <Label>Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  value={webhookUrl}
                  readOnly
                  className="font-mono text-xs"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopyWebhookUrl}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                POST requests to this URL will trigger the event
              </p>
            </div>

            <Separator />

            {/* Listen Event */}
            <div className="space-y-3">
              <div>
                <Label>Test Event</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Listen for incoming events to verify your configuration
                </p>
              </div>
              <Button
                onClick={handleOpenListenDialog}
                className="w-full"
                variant="outline"
              >
                <Play className="w-4 h-4" />
                Listen Event
              </Button>
            </div>

            <Separator />

            {/* Expected Payload */}
            <div className="space-y-3">
              <Label>Expected Payload Structure</Label>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-10"
                  onClick={handleCopyPayload}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto text-xs">
                  <code>{JSON.stringify(examplePayload, null, 2)}</code>
                </pre>
              </div>
              <p className="text-xs text-muted-foreground">
                Send a POST request with this structure to trigger the event
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

