"use client"

import Image from "next/image"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Plus, Users, Wrench, Settings, CheckCircle2 } from "lucide-react"

// Mock data for tools
type Tool = {
  id: string
  name: string
  description: string
  category: string
  connected: boolean
  toolCount: number
  actionCount: number
  logo: string
  iconBgColor: string
}

const mockTools: Tool[] = [
  {
    id: "1",
    name: "Google Calendar",
    description: "Connect with Google Calendar to schedule appointments automatically",
    category: "Integration",
    connected: true,
    toolCount: 12,
    actionCount: 342,
    logo: "/logos/google-calendar.svg",
    iconBgColor: "bg-white/50 dark:bg-white/5",
  },
  {
    id: "2",
    name: "Stripe",
    description: "Process payments and manage subscriptions directly from your calls",
    category: "Integration",
    connected: false,
    toolCount: 8,
    actionCount: 278,
    logo: "/logos/stripe.svg",
    iconBgColor: "bg-white/50 dark:bg-white/5",
  },
  {
    id: "3",
    name: "Slack",
    description: "Send notifications and updates to your Slack workspace in real-time",
    category: "Integration",
    connected: true,
    toolCount: 5,
    actionCount: 156,
    logo: "/logos/slack.svg",
    iconBgColor: "bg-white/50 dark:bg-white/5",
  },
  {
    id: "4",
    name: "Gmail",
    description: "Send automated emails and manage communications through Gmail",
    category: "Integration",
    connected: false,
    toolCount: 6,
    actionCount: 198,
    logo: "/logos/gmail.svg",
    iconBgColor: "bg-white/50 dark:bg-white/5",
  },
]

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Tools" />

      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        <div className="p-6 space-y-6">
          {/* Row 1: Three Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Integrations Button */}
            <Button 
              variant="default" 
              className="h-auto py-4 px-4 flex-col items-start gap-3 relative"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary-foreground/10">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="font-semibold text-base">Integrations</span>
              </div>
              <p className="text-xs text-left opacity-90 font-normal">
                Connect with external services and APIs
              </p>
            </Button>

            {/* Create Tool Button */}
            <Button 
              variant="outline" 
              className="h-auto py-4 px-4 flex-col items-start gap-3 relative" 
              disabled
            >
              <Badge variant="outline" className="absolute top-2 right-2 text-xs border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-500">
                Coming Soon
              </Badge>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="font-semibold text-base">Create Tool</span>
              </div>
              <p className="text-xs text-left text-muted-foreground font-normal">
                Build custom tools for your agents
              </p>
            </Button>

            {/* Community Tools Button */}
            <Button 
              variant="outline" 
              className="h-auto py-4 px-4 flex-col items-start gap-3 relative" 
              disabled
            >
              <Badge variant="outline" className="absolute top-2 right-2 text-xs border-yellow-500 text-yellow-600 bg-yellow-50 dark:bg-yellow-950/30 dark:text-yellow-500">
                Coming Soon
              </Badge>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Users className="h-5 w-5" />
                </div>
                <span className="font-semibold text-base">Community Tools</span>
              </div>
              <p className="text-xs text-left text-muted-foreground font-normal">
                Explore tools shared by the community
              </p>
            </Button>
          </div>

          {/* Separator */}
          <Separator />

          {/* Row 2: Four Column Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockTools.map((tool) => {
              return (
                <Card key={tool.id} className="relative bg-background/50 backdrop-blur-sm">
                  {/* Content */}
                  <CardContent className="space-y-4">
                    <div className="flex items-start justify-between">
                      {/* Logo Box with actual logo */}
                      <div className={`w-14 h-14 min-w-14 min-h-14 rounded-xl ${tool.iconBgColor} flex items-center justify-center p-2.5 border shrink-0`}>
                        <div className="relative w-8 h-8">
                          <Image
                            src={tool.logo}
                            alt={`${tool.name} logo`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Connect/Connected Button */}
                      {tool.connected ? (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8 gap-1.5 border-green-500 text-green-600 bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:text-green-500 dark:hover:bg-green-950/50"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Connected
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="h-8">
                          Connect
                        </Button>
                      )}
                    </div>

                    {/* Integration Name */}
                    <div className="space-y-2">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </CardContent>

                  {/* Shorter Separator */}
                  <div className="px-6">
                    <Separator />
                  </div>

                  {/* Footer with stats - reduced height */}
                  <CardFooter className="flex items-center justify-between">
                    {/* Left: Tool count */}
                    <div className="flex items-center gap-1.5 text-sm">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{tool.toolCount}</span>
                      <span className="text-muted-foreground">tools</span>
                    </div>

                    {/* Right: Action count */}
                    <div className="flex items-center gap-1.5 text-sm">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{tool.actionCount}</span>
                      <span className="text-muted-foreground">actions</span>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}