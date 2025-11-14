"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Plus, FileText, Users, Workflow, Wand2 } from "lucide-react"

export default function Page() {
  const router = useRouter()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mode, setMode] = useState<"generate" | "scratch">("generate")
  
  // Form states
  const [pathwayName, setPathwayName] = useState("")
  const [useCase, setUseCase] = useState("")
  const [agentSpeech, setAgentSpeech] = useState("")
  
  // Progress states
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const handleDialogOpen = (open: boolean) => {
    setDialogOpen(open)
    if (open) {
      setMode("generate")
      // Reset form
      setPathwayName("")
      setUseCase("")
      setAgentSpeech("")
      setIsGenerating(false)
      setProgress(0)
    }
  }

  const handleModeSwitch = () => {
    setMode("scratch")
  }

  // Validation
  const isGenerateValid = pathwayName.trim() !== "" && useCase.trim() !== "" && agentSpeech.trim() !== ""
  const isCreateValid = pathwayName.trim() !== ""

  // Progress simulation
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            // Redirect to dynamic page with a mock ID
            const newId = Date.now().toString()
            setTimeout(() => {
              router.push(`/conversation-paths/${newId}`)
            }, 500)
            return 100
          }
          return prev + 10
        })
      }, 300)
      
      return () => clearInterval(interval)
    }
  }, [isGenerating, router])

  const handleGenerate = () => {
    setIsGenerating(true)
    setProgress(0)
  }

  const handleCreate = () => {
    // Create pathway and redirect
    const newId = Date.now().toString()
    router.push(`/conversation-paths/${newId}`)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpen}>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <PageHeader title="Conversation Paths">
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Pathway
            </Button>
          </DialogTrigger>
        </PageHeader>
      
      <div className="flex-1 rounded-lg border bg-background shadow-sm">
        <div className="p-6 space-y-6">
          {/* Row 1: Three Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Create a Pathway Button */}
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="h-auto py-4 px-4 flex-col items-start gap-3 relative border-primary hover:bg-accent"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-base">Create a Pathway</span>
                </div>
                <p className="text-xs text-left text-muted-foreground font-normal">
                  Build custom conversation flows for your agents
                </p>
              </Button>
            </DialogTrigger>

            {/* Explore Templates Button */}
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
                  <FileText className="h-5 w-5" />
                </div>
                <span className="font-semibold text-base">Explore Templates</span>
              </div>
              <p className="text-xs text-left text-muted-foreground font-normal">
                Start with pre-built conversation templates
              </p>
            </Button>

            {/* Community Paths Button */}
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
                <span className="font-semibold text-base">Community Paths</span>
              </div>
              <p className="text-xs text-left text-muted-foreground font-normal">
                Discover paths shared by the community
              </p>
            </Button>
          </div>

          {/* Separator */}
          <Separator />

          {/* Empty State */}
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Workflow />
              </EmptyMedia>
              <EmptyTitle>No Conversation Paths Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any conversation paths yet. Design custom flows to guide your AI agents through complex conversations.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    </div>

      {/* Dialog Content */}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              {mode === "generate" ? (
                <Wand2 className="h-5 w-5" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </div>
            {mode === "generate" ? "Generate Pathway" : "Create from Scratch"}
          </DialogTitle>
          <DialogDescription>
            {mode === "generate"
              ? "Let AI generate a conversation pathway based on your use case"
              : "Create a custom conversation pathway from scratch"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Pathway Name - Always visible */}
          <div className="grid gap-2">
            <Label htmlFor="pathway-name">Pathway Name</Label>
            <Input
              id="pathway-name"
              placeholder="e.g., Customer Support Flow"
              value={pathwayName}
              onChange={(e) => setPathwayName(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          {/* Use Case and Agent Speech - Only in generate mode */}
          {mode === "generate" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="use-case">Use Case</Label>
                <Textarea
                  id="use-case"
                  placeholder="Describe what this pathway should accomplish..."
                  className="min-h-[80px]"
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  disabled={isGenerating}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="agent-speech">Agent Speech Example</Label>
                <Textarea
                  id="agent-speech"
                  placeholder="Example: Hello! How can I help you today?"
                  className="min-h-[80px]"
                  value={agentSpeech}
                  onChange={(e) => setAgentSpeech(e.target.value)}
                  disabled={isGenerating}
                />
              </div>
            </>
          )}

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-2 pt-2">
              <div className="space-y-1">
                <p className="text-sm font-medium">Analyzing Your Requirements</p>
                <p className="text-xs text-muted-foreground">Understanding your use case and objectives...</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>

        <DialogFooter>
          {mode === "generate" ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleModeSwitch}
                disabled={isGenerating}
              >
                Create from Scratch
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={!isGenerateValid || isGenerating}
              >
                Generate Pathway
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="outline" 
                onClick={() => setMode("generate")}
              >
                Back to Generate
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!isCreateValid}
              >
                Create Pathway
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
