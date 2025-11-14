"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Plus, Radio, Copy, Code2, Link2, Activity } from "lucide-react"

interface Event {
  id: string
  name: string
  description?: string
  isEnabled: boolean
  agent: {
    id: string
    name: string
  }
  webhookUrl: string
  triggerCount: number
  createdAt: string
}

export default function Page() {
  const router = useRouter()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [eventName, setEventName] = useState("")
  const [selectedPayload, setSelectedPayload] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([
    {
      id: "customer-support",
      name: "Customer Support Request",
      description: "Triggered when a customer needs support assistance",
      isEnabled: true,
      agent: {
        id: "agent-1",
        name: "Customer Support",
      },
      webhookUrl: "https://api.yourapp.com/events/customer-support",
      triggerCount: 156,
      createdAt: "2024-01-10",
    },
    {
      id: "sales-inquiry",
      name: "Sales Inquiry",
      description: "Activated for new sales opportunities and product inquiries",
      isEnabled: true,
      agent: {
        id: "agent-2",
        name: "Sales Assistant",
      },
      webhookUrl: "https://api.yourapp.com/events/sales-inquiry",
      triggerCount: 89,
      createdAt: "2024-01-12",
    },
    {
      id: "appointment-booking",
      name: "Appointment Booking",
      isEnabled: false,
      agent: {
        id: "agent-3",
        name: "Appointment Scheduler",
      },
      webhookUrl: "https://api.yourapp.com/events/appointment-booking",
      triggerCount: 42,
      createdAt: "2024-01-15",
    },
  ])

  const handleOpenCreateDialog = () => {
    setIsCreateDialogOpen(true)
  }

  const handleCreateEvent = () => {
    if (eventName.trim()) {
      // Generate a simple ID from the event name
      const eventId = eventName.toLowerCase().replace(/\s+/g, '-')
      
      // Close dialog and navigate to event settings page
      setIsCreateDialogOpen(false)
      setEventName("")
      router.push(`/events/${eventId}`)
    }
  }

  const handleCancelCreate = () => {
    setEventName("")
    setIsCreateDialogOpen(false)
  }

  const handleToggleEvent = (eventId: string) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, isEnabled: !event.isEnabled } : event
    ))
  }

  const handleCopyWebhook = (url: string) => {
    navigator.clipboard.writeText(url)
  }

  const handleOpenPayload = (eventId: string) => {
    setSelectedPayload(eventId)
  }

  const handleClosePayload = () => {
    setSelectedPayload(null)
  }

  const handleCopyPayload = (eventId: string) => {
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

  const isFormValid = eventName.trim() !== ""
  const hasEvents = events.length > 0

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Events">
        <Button size="sm" onClick={handleOpenCreateDialog}>
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </PageHeader>

      {/* Create Event Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Create a custom event to track and monitor specific actions in your AI agents.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="event-name" className="mb-2">
              Event Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="event-name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter event name..."
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === "Enter" && isFormValid) {
                  handleCreateEvent()
                }
              }}
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCancelCreate}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={!isFormValid}
            >
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payload Dialog */}
      {selectedPayload && (
        <Dialog open={!!selectedPayload} onOpenChange={handleClosePayload}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Event Payload</DialogTitle>
              <DialogDescription>
                Example payload structure for this event
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 z-10"
                  onClick={() => handleCopyPayload(selectedPayload)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
                <pre className="rounded-lg bg-muted p-4 overflow-x-auto text-xs max-h-[400px]">
                  <code>{JSON.stringify({
                    event: selectedPayload,
                    timestamp: new Date().toISOString(),
                    data: {
                      transcript: "example text",
                      callId: "call_123456",
                      duration: 120,
                      metadata: {}
                    }
                  }, null, 2)}</code>
                </pre>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleClosePayload}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        <div className="p-6">
          {!hasEvents ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Radio/>
                  </EmptyMedia>
                  <EmptyTitle>No Events Yet</EmptyTitle>
                  <EmptyDescription>
                    Create custom events to track and monitor specific actions in your AI agents.               
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      Learn More
                    </Button>
                    <Button onClick={handleOpenCreateDialog}>
                      <Plus className="w-4 h-4" />
                      Create Event
                    </Button>
                  </div>
                </EmptyContent>
              </Empty>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {events.map((event) => (
                <Card 
                  key={event.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-2 flex items-center gap-2">
                          <Radio className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{event.name}</span>
                        </CardTitle>
                        {event.description && (
                          <CardDescription className="text-sm line-clamp-2">
                            {event.description}
                          </CardDescription>
                        )}
                      </div>
                      <div onClick={(e) => e.stopPropagation()}>
                        <Switch
                          checked={event.isEnabled}
                          onCheckedChange={() => handleToggleEvent(event.id)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Webhook URL */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Link2 className="w-3 h-3" />
                        <span>Webhook URL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={event.webhookUrl}
                          readOnly
                          className="text-xs font-mono h-8"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyWebhook(event.webhookUrl)
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Payload & Trigger Count */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenPayload(event.id)
                        }}
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        View Payload
                      </Button>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold">{event.triggerCount}</span>
                        <span className="text-muted-foreground">triggers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}