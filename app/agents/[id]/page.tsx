"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { PageHeader } from "@/components/page-header"
import { ChevronRight, Pencil, Check, X, Save, Trash2, PhoneIcon, PhoneOffIcon, Send, Mic, MicOff, PhoneCall, FileText, Wrench, GitBranch } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Orb } from "@/components/ui/orb"
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation"
import { Message, MessageContent } from "@/components/ui/message"
import { Response } from "@/components/ui/response"
import { ShimmeringText } from "@/components/ui/shimmering-text"
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
import { cn } from "@/lib/utils"

// Mock data
const mockAgent = {
  id: "1",
  name: "Customer Support Agent",
  status: "active" as "active" | "inactive",
  role: "Inbound Support",
  callCount: 1247,
  documents: 24,
  tools: 5,
  conversationalPaths: 8,
}

interface ChatMessage {
  role: "user" | "assistant"
  content: string
  timestamp?: Date
}

export default function AgentDetailPage() {
  const router = useRouter()
  const [agentName, setAgentName] = useState(mockAgent.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editableName, setEditableName] = useState(mockAgent.name)
  const [isActive, setIsActive] = useState(mockAgent.status === "active")
  const [isSaved, setIsSaved] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  
  // Conversation states
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [agentState, setAgentState] = useState<"disconnected" | "connecting" | "connected" | "disconnecting" | null>("disconnected")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [textInput, setTextInput] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const volumeRef = useRef(0)

  const handleSaveName = () => {
    setAgentName(editableName)
    setIsEditingName(false)
  }

  const handleCancelEdit = () => {
    setEditableName(agentName)
    setIsEditingName(false)
  }

  const handleSave = () => {
    // Save logic here
    console.log("Saving agent...")
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const handleDelete = () => {
    // Delete logic here
    console.log("Deleting agent...")
    setShowDeleteDialog(false)
    router.push("/agents")
  }

  // Simulated volume animation
  useEffect(() => {
    if (agentState === "connected" && !isMuted) {
      const interval = setInterval(() => {
        volumeRef.current = Math.random() * 0.5 + 0.3
      }, 100)
      return () => clearInterval(interval)
    } else {
      volumeRef.current = 0
    }
  }, [agentState, isMuted])

  // Voice call handlers (Simulated)
  const startConversation = useCallback(async () => {
    try {
      setErrorMessage(null)
      setAgentState("connecting")
      
      // Simulate connection delay
      setTimeout(() => {
        setAgentState("connected")
        setMessages([])
        
        // Simulate initial conversation
        setTimeout(() => {
          const initialMessages: ChatMessage[] = [
            {
              role: "assistant",
              content: "Hello! Welcome to our customer support service. I'm here to assist you with any questions or concerns you may have. Whether you need help with product information, account management, technical support, or general inquiries, I'm ready to help. How can I assist you today?",
              timestamp: new Date()
            },
            {
              role: "user",
              content: "Hi! I'm interested in learning more about your services.",
              timestamp: new Date()
            },
            {
              role: "assistant",
              content: "Great! I'd be happy to tell you more about our services. We offer comprehensive solutions tailored to meet your specific needs. Could you tell me which area you're most interested in?",
              timestamp: new Date()
            },
            {
              role: "user",
              content: "I'd like to know about pricing and features.",
              timestamp: new Date()
            },
            {
              role: "assistant",
              content: "Excellent question! Our pricing is flexible and scales with your needs. We have several tiers available, each with different feature sets. Let me break down the main features for you...",
              timestamp: new Date()
            }
          ]
          setMessages(initialMessages)
        }, 800)
      }, 1500)
    } catch (error) {
      console.error("Error starting conversation:", error)
      setAgentState("disconnected")
      setErrorMessage("Failed to start conversation.")
    }
  }, [])

  const handleCall = useCallback(() => {
    if (agentState === "disconnected" || agentState === null) {
      startConversation()
    } else if (agentState === "connected") {
      setAgentState("disconnecting")
      setTimeout(() => {
        setAgentState("disconnected")
        setMessages([])
      }, 500)
    }
  }, [agentState, startConversation])

  const handleSendMessage = useCallback(() => {
    if (!textInput.trim() || agentState !== "connected") return

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: textInput,
      timestamp: new Date()
    }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = textInput
    setTextInput("")

    // Simulate AI typing and response with longer, more realistic responses
    const responses = [
      `Thank you for reaching out! I understand you mentioned "${currentInput}". Let me help you with that. Based on what you've shared, I can provide several options and recommendations that might be useful for your situation.`,
      `That's a great question about "${currentInput}". From my experience, there are multiple approaches we could take here. First, let me explain the most common solution, and then I'll walk you through some alternatives that might better suit your specific needs.`,
      `I appreciate you bringing up "${currentInput}". This is actually a topic I help customers with quite frequently. Let me break this down into a few key points that should clarify things for you and help you move forward with confidence.`,
      `Thanks for sharing that information. Regarding "${currentInput}", I'd like to provide you with a comprehensive answer. There are several important factors to consider, and I'll make sure to cover each one so you have a complete understanding.`,
      `I see you're asking about "${currentInput}". Let me help you navigate this. Based on similar situations I've encountered, I can suggest a step-by-step approach that has proven effective. Would you like me to walk you through the process?`,
    ]
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)]
    
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "assistant",
        content: randomResponse,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500 + Math.random() * 2000)
  }, [textInput, agentState])

  const getInputVolume = useCallback(() => {
    return agentState === "connected" && !isMuted ? volumeRef.current : 0
  }, [agentState, isMuted])

  const getOutputVolume = useCallback(() => {
    return agentState === "connected" ? volumeRef.current * 0.8 : 0
  }, [agentState])

  const isCallActive = agentState === "connected"
  const isTransitioning = agentState === "connecting" || agentState === "disconnecting"

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => router.push("/agents")}
            >
              Agents
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            {isEditingName ? (
                <div className="flex items-center gap-2">
                      <Input
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className="h-8 w-[250px]"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                      handleSaveName()
                          } else if (e.key === 'Escape') {
                      handleCancelEdit()
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                  onClick={handleSaveName}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                  onClick={handleCancelEdit}
                      >
                        <X className="h-3 w-3" />
                      </Button>
              </div>
                  ) : (
                    <>
                <span>{agentName}</span>
                      <button
                  onClick={() => setIsEditingName(true)}
                        className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-4 w-4 shrink-0"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
        }
        actions={
          <div className="flex items-center gap-3">
            {/* Active Toggle */}
                <div className="flex items-center gap-2">
              <Label htmlFor="active-toggle" className="text-sm font-normal cursor-pointer">
                Active
              </Label>
              <Switch
                id="active-toggle"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            {/* Save Button */}
                      <Button
              size="sm"
              className="gap-2"
              onClick={handleSave}
              variant="outline"
            >
              {isSaved ? (
                <>
                  <Check className="h-4 w-4" />
                  Saved
                    </>
                  ) : (
                    <>
                  <Save className="h-4 w-4" />
                  Save
                    </>
                  )}
            </Button>

            {/* Delete Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="destructive-outline"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete Agent</TooltipContent>
            </Tooltip>
          </div>
        }
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent &quot;{agentName}&quot;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 min-h-0">
        {/* Left Panel */}
        <div className="flex-[7] flex flex-col min-w-0 rounded-lg border overflow-hidden">
          <Tabs defaultValue="general" className="w-full flex-1 flex flex-col">
            <div className="px-4 pt-4">
              <TabsList className="w-full">
                <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
                <TabsTrigger value="prompt" className="flex-1">Prompt</TabsTrigger>
                <TabsTrigger value="knowledge" className="flex-1">Knowledge</TabsTrigger>
                <TabsTrigger value="tools" className="flex-1">Tools</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <TabsContent value="general" className="mt-0 p-6 space-y-6">
                {/* Agent Info Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Agent Avatar & Info */}
                    <div className="flex items-center gap-3">
                      <div className="relative size-14">
                        <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                          <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                            <Orb className="h-full w-full" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">{agentName}</h2>
                        <p className="text-sm text-muted-foreground">{mockAgent.role}</p>
                      </div>
                    </div>

                    {/* Right: Stats */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                      <div className="flex items-center gap-1.5">
                        <PhoneCall className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.callCount}</span>
                        <span className="text-muted-foreground">Calls</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.documents}</span>
                        <span className="text-muted-foreground">Docs</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <Wrench className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.tools}</span>
                        <span className="text-muted-foreground">Tools</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1.5">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{mockAgent.conversationalPaths}</span>
                        <span className="text-muted-foreground">Paths</span>
                      </div>
                    </div>
                  </div>

                  <Separator />
                </div>

                {/* Additional General Content Will Go Here */}
              </TabsContent>

              <TabsContent value="prompt" className="mt-0 p-6">
                {/* Prompt content */}
              </TabsContent>

              <TabsContent value="knowledge" className="mt-0 p-6">
                {/* Knowledge content */}
              </TabsContent>

              <TabsContent value="tools" className="mt-0 p-6">
                {/* Tools content */}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Right Panel - Voice Chat */}
        <div className="w-full lg:flex-[3] flex flex-col overflow-hidden relative min-w-0 rounded-lg">
          {agentState === "disconnected" || agentState === null ? (
            /* Initial Voice Chat State */
            <Card className="flex h-full w-full flex-col">
              <CardHeader>
                <CardTitle className="text-sm">Preview your agent</CardTitle>
                <CardDescription className="text-xs">
                  Test your agent's conversation flow and responses
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="flex flex-col items-center gap-6">
                <div className="relative size-32">
                  <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                    <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                      <Orb
                        className="h-full w-full"
                        volumeMode="manual"
                        getInputVolume={getInputVolume}
                        getOutputVolume={getOutputVolume}
                      />
                    </div>
            </div>
          </div>

                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-xl font-semibold">{agentName}</h2>
                  <AnimatePresence mode="wait">
                    {errorMessage ? (
                      <motion.p
                        key="error"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-destructive text-center text-sm"
                      >
                        {errorMessage}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="disconnected"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="text-muted-foreground text-sm"
                      >
                        Tap to start voice chat
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  onClick={handleCall}
                  disabled={isTransitioning}
                  size="icon"
                  variant={isCallActive ? "secondary" : "default"}
                  className="h-12 w-12 rounded-full"
                >
                  <PhoneIcon className="h-5 w-5" />
                </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Chat Interface */
            <Card className="flex h-full w-full flex-col">
              {/* Orb Header - Fixed at top */}
              <CardHeader className="pb-3 space-y-0 border-b">
                <div className="flex flex-col items-center gap-2">
                  <div className="relative size-20">
                    <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                      <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                        <Orb 
                          className="h-full w-full"
                          volumeMode="manual"
                          getInputVolume={getInputVolume}
                          getOutputVolume={getOutputVolume}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-1">
                    <h3 className="text-sm font-semibold">{agentName}</h3>
                    <AnimatePresence mode="wait">
                      {isTransitioning ? (
                        <motion.div
                          key="status"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <div className={cn(
                            "h-2 w-2 rounded-full transition-all duration-300",
                            "bg-primary/60 animate-pulse"
                          )} />
                          <span className="text-xs capitalize text-muted-foreground">
                            <ShimmeringText text={agentState!} />
                          </span>
                        </motion.div>
                      ) : isCallActive ? (
                        <motion.div
                          key="connected"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex items-center gap-2"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-500" />
                          <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {/* Messages Area - Scrollable */}
                <div className="flex-1 overflow-hidden relative">
                  <Conversation className="absolute inset-0">
                    <ConversationContent className="flex min-w-0 flex-col gap-3 p-2">
                    {messages.map((message, index) => {
                      return (
                        <Message key={index} from={message.role}>
                          <MessageContent className="max-w-[85%]">
                            <Response className="text-sm whitespace-pre-wrap break-words">
                              {message.content}
                            </Response>
                          </MessageContent>
                          {message.role === "user" ? (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                                You
                              </AvatarFallback>
                            </Avatar>
                          ) : (
                            <div className="h-8 w-8 rounded-full overflow-hidden ring-1 ring-border flex-shrink-0">
                              <Orb className="h-full w-full" />
                            </div>
                          )}
                        </Message>
                      )
                    })}
                    </ConversationContent>
                    <ConversationScrollButton className="bottom-[48px]" />
                  </Conversation>
                  </div>

                {/* Input Bar - Fixed at bottom */}
                <div className="border-t px-2 py-2 flex items-center">
                  <div className="flex items-center gap-1.5 w-full">
                  {/* Text Input */}
                  <Input
                    placeholder="Type a message..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1 h-8"
                  />

                  {/* Send Button */}
              <Button 
                    onClick={handleSendMessage}
                    disabled={!textInput.trim()}
                    size="icon"
                    className="h-8 w-8 shrink-0"
                  >
                    <Send className="h-3.5 w-3.5" />
              </Button>

                  {/* Mute Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
              <Button 
                          variant="outline"
                          size="icon"
                          onClick={() => setIsMuted(!isMuted)}
                          className={cn("h-8 w-8", isMuted && "border-destructive text-destructive")}
                        >
                          {isMuted ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
              </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isMuted ? "Unmute" : "Mute"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* End Call Button */}
                  <Button 
                    onClick={handleCall}
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <PhoneOffIcon className="h-3.5 w-3.5" />
                  </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}