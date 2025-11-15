"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Plus, Megaphone, ArrowUpRightIcon } from "lucide-react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { getCampaignStatusConfig, type CampaignStatusType } from "@/lib/helpers"

// Mock data for campaigns
type Campaign = {
  id: string
  batchName: string
  status: CampaignStatusType
  progress: number
  totalCalls: number
  completedCalls: number
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    batchName: "Q4 Product Launch Campaign",
    status: "continuing",
    progress: 65,
    totalCalls: 1000,
    completedCalls: 650,
  },
  {
    id: "2",
    batchName: "Customer Feedback Survey",
    status: "completed",
    progress: 100,
    totalCalls: 500,
    completedCalls: 500,
  },
  {
    id: "3",
    batchName: "Holiday Promotion Campaign",
    status: "planned",
    progress: 0,
    totalCalls: 2000,
    completedCalls: 0,
  },
  {
    id: "4",
    batchName: "Appointment Reminders - November",
    status: "draft",
    progress: 0,
    totalCalls: 750,
    completedCalls: 0,
  },
  {
    id: "5",
    batchName: "Summer Sales Campaign",
    status: "stopped",
    progress: 42,
    totalCalls: 1500,
    completedCalls: 630,
  },
]

export default function Page() {
  const router = useRouter()
  const [hasCampaigns, setHasCampaigns] = useState(true)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader title="Campaigns">
        <Button 
          size="sm" 
          className="gap-2"
          onClick={() => router.push("/campaigns/create")}
        >
          <Plus className="h-4 w-4" />
          Create Campaign
        </Button>
      </PageHeader>
    
      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        {!hasCampaigns ? (
          <div className="flex items-center justify-center min-h-[500px] p-4">
            <Empty className="border border-dashed max-w-2xl">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Megaphone />
                </EmptyMedia>
                <EmptyTitle>No Campaigns Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any campaigns yet. Create your first campaign to start reaching out to your contacts with AI-powered voice agents.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => router.push("/campaigns/create")}>
                  <Plus className="h-4 w-4" />
                  Create Your First Campaign
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
            <div className="space-y-4">
              {mockCampaigns.map((campaign) => {
                const statusConfig = getCampaignStatusConfig(campaign.status)
                return (
                  <Card
                    key={campaign.id}
                    className="w-full cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/campaigns/${campaign.id}`)}
                  >
                    {/* Header with batch name and status */}
                    <CardHeader>
                      <div className="flex items-start justify-between w-full mb-[-10px]">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{campaign.batchName}</CardTitle>
                        </div>
                        <Badge
                          variant="outline"
                          className={`gap-1.5 shrink-0 ${statusConfig.color}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${statusConfig.dotColor}`}></span>
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </CardHeader>

                  <Separator />

                  {/* Content with progress */}
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Progress</span>
                      <span className="text-muted-foreground">
                        {campaign.completedCalls} / {campaign.totalCalls} calls
                      </span>
                    </div>
                    <Progress value={campaign.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{campaign.progress}% Complete</span>
                      {campaign.progress > 0 && campaign.progress < 100 && (
                        <span>{campaign.totalCalls - campaign.completedCalls} remaining</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}