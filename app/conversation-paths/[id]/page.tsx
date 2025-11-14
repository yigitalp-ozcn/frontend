"use client"

import { useCallback, useState, useEffect } from "react"
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Save,
  Plus,
  StickyNote,
  ZoomIn,
  ZoomOut,
  Maximize,
  Sparkles,
  Undo2,
  Redo2,
  Pencil,
  Copy,
  Phone,
  Check,
} from "lucide-react"

// Custom Node Components
const ConversationNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-lg border-2 border-primary bg-background min-w-[200px]">
      <div className="font-semibold text-sm mb-1">{data.label}</div>
      {data.description && (
        <div className="text-xs text-muted-foreground">{data.description}</div>
      )}
    </div>
  )
}

const NoteNode = ({ data }: { data: any }) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-lg bg-yellow-100 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 min-w-[200px]">
      <div className="text-sm">{data.label}</div>
    </div>
  )
}

const nodeTypes = {
  conversation: ConversationNode,
  note: NoteNode,
}

const initialNodes: Node[] = [
  {
    id: "1",
    type: "conversation",
    position: { x: 250, y: 50 },
    data: { label: "Start Conversation", description: "Initial greeting" },
  },
  {
    id: "2",
    type: "conversation",
    position: { x: 250, y: 200 },
    data: { label: "Collect Information", description: "Ask for user details" },
  },
  {
    id: "3",
    type: "note",
    position: { x: 500, y: 100 },
    data: { label: "Important: Check user authentication first" },
  },
]

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
]

function FlowEditor({ params }: { params: { id: string } }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const { fitView, zoomIn, zoomOut, getNodes, getEdges } = useReactFlow()
  
  // History for undo/redo
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([
    { nodes: initialNodes, edges: initialEdges },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [newNodeLabel, setNewNodeLabel] = useState("")
  const [newNodeDescription, setNewNodeDescription] = useState("")

  // Header state
  const [isActive, setIsActive] = useState(true)
  const [isSaved, setIsSaved] = useState(true)
  const [pathwayName, setPathwayName] = useState(`Pathway ${params.id}`)
  const [isEditingName, setIsEditingName] = useState(false)

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdges = addEdge({ ...params, animated: true }, edges)
      setEdges(newEdges)
      saveToHistory(nodes, newEdges)
    },
    [edges, nodes]
  )

  const saveToHistory = useCallback(
    (newNodes: Node[], newEdges: Edge[]) => {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push({ nodes: newNodes, edges: newEdges })
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    },
    [history, historyIndex]
  )

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setNodes(history[newIndex].nodes)
      setEdges(history[newIndex].edges)
    }
  }, [historyIndex, history, setNodes, setEdges])

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setNodes(history[newIndex].nodes)
      setEdges(history[newIndex].edges)
    }
  }, [historyIndex, history, setNodes, setEdges])

  const handleZoomToFit = useCallback(() => {
    fitView({ padding: 0.2, duration: 800 })
  }, [fitView])

  const handleTidyUp = useCallback(() => {
    // Simple auto-layout algorithm
    const currentNodes = getNodes()
    const arranged = currentNodes.map((node, index) => ({
      ...node,
      position: {
        x: 100 + (index % 3) * 300,
        y: 100 + Math.floor(index / 3) * 200,
      },
    }))
    setNodes(arranged)
    saveToHistory(arranged, edges)
    setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 100)
  }, [getNodes, setNodes, edges, fitView, saveToHistory])

  const addConversationNode = useCallback(() => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: "conversation",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: newNodeLabel || "New Step", description: newNodeDescription || "Add description here" },
    }
    const newNodes = [...nodes, newNode]
    setNodes(newNodes)
    saveToHistory(newNodes, edges)
    setDrawerOpen(false)
    setNewNodeLabel("")
    setNewNodeDescription("")
  }, [nodes, edges, setNodes, saveToHistory, newNodeLabel, newNodeDescription])

  const addNoteNode = useCallback(() => {
    const newNode: Node = {
      id: `note-${Date.now()}`,
      type: "note",
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: "Add your note here..." },
    }
    const newNodes = [...nodes, newNode]
    setNodes(newNodes)
    saveToHistory(newNodes, edges)
  }, [nodes, edges, setNodes, saveToHistory])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: Add new node (open drawer)
      if ((e.ctrlKey || e.metaKey) && e.key === "n") {
        e.preventDefault()
        setDrawerOpen(true)
      }
      // Ctrl/Cmd + Shift + N: Add note
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "N") {
        e.preventDefault()
        addNoteNode()
      }
      // Ctrl/Cmd + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y: Redo
      if (((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "Z") || ((e.ctrlKey || e.metaKey) && e.key === "y")) {
        e.preventDefault()
        handleRedo()
      }
      // Ctrl/Cmd + 0: Zoom to fit
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault()
        handleZoomToFit()
      }
      // Ctrl/Cmd + =: Zoom in
      if ((e.ctrlKey || e.metaKey) && e.key === "=") {
        e.preventDefault()
        zoomIn({ duration: 400 })
      }
      // Ctrl/Cmd + -: Zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === "-") {
        e.preventDefault()
        zoomOut({ duration: 400 })
      }
      // Ctrl/Cmd + Shift + T: Tidy up
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault()
        handleTidyUp()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [addNoteNode, handleUndo, handleRedo, handleZoomToFit, handleTidyUp, zoomIn, zoomOut])

  const handleCopyId = useCallback(() => {
    navigator.clipboard.writeText(params.id)
  }, [params.id])

  const handleSave = useCallback(() => {
    // Save logic here
    setIsSaved(true)
  }, [])

  const handleTestCall = useCallback(() => {
    // Test call logic here
    console.log("Testing call...")
  }, [])

  // Mark as unsaved when changes are made
  useEffect(() => {
    setIsSaved(false)
  }, [nodes, edges])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader 
        title={
          <div className="flex items-center gap-2">
            {isEditingName ? (
              <Input
                value={pathwayName}
                onChange={(e) => setPathwayName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setIsEditingName(false)
                  if (e.key === "Escape") {
                    setPathwayName(`Pathway ${params.id}`)
                    setIsEditingName(false)
                  }
                }}
                className="h-7 w-auto min-w-[200px]"
                autoFocus
              />
            ) : (
              <>
                <span>{pathwayName}</span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => setIsEditingName(true)}
                  className="h-6 w-6"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        }
      >
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

          {/* Copy ID */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={handleCopyId}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy ID</TooltipContent>
          </Tooltip>

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

          {/* Test Call Button */}
          <Button
            size="sm"
            className="gap-2"
            onClick={handleTestCall}
          >
            <Phone className="h-4 w-4" />
            Test Call
          </Button>
        </div>
      </PageHeader>
      
      <div className="flex-1 rounded-lg border bg-background shadow-sm overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-muted/10"
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

          {/* Top Right Controls - Add Nodes */}
          <Panel position="top-right" className="flex flex-col gap-2">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="right">
              <Tooltip>
                <TooltipTrigger asChild>
                  <DrawerTrigger asChild>
                    <Button
                      size="icon-lg"
                      className="shadow-lg"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </DrawerTrigger>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <div className="flex flex-col gap-1">
                    <span>Add New Node</span>
                    <kbd className="text-xs opacity-70">Ctrl+N</kbd>
                  </div>
                </TooltipContent>
              </Tooltip>

              <DrawerContent direction="right">
                <DrawerHeader>
                  <DrawerTitle>Add New Conversation Node</DrawerTitle>
                  <DrawerDescription>
                    Create a new conversation step in your pathway
                  </DrawerDescription>
                </DrawerHeader>

                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="node-label">Label</Label>
                    <Input
                      id="node-label"
                      placeholder="e.g., Collect User Info"
                      value={newNodeLabel}
                      onChange={(e) => setNewNodeLabel(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newNodeLabel) {
                          addConversationNode()
                        }
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="node-description">Description</Label>
                    <Textarea
                      id="node-description"
                      placeholder="Add a description for this step..."
                      value={newNodeDescription}
                      onChange={(e) => setNewNodeDescription(e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>

                <DrawerFooter>
                  <Button onClick={addConversationNode} disabled={!newNodeLabel}>
                    Add Node
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-lg"
                  onClick={addNoteNode}
                  className="shadow-lg"
                >
                  <StickyNote className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <div className="flex flex-col gap-1">
                  <span>Add Note</span>
                  <kbd className="text-xs opacity-70">Ctrl+Shift+N</kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          </Panel>

          {/* Bottom Left Controls - View & Layout */}
          <Panel position="bottom-left" className="flex gap-2 flex-wrap max-w-[280px]">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  onClick={handleZoomToFit}
                  className="shadow-lg"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <span>Zoom to Fit</span>
                  <kbd className="text-xs opacity-70">Ctrl+0</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  onClick={() => zoomIn({ duration: 400 })}
                  className="shadow-lg"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <span>Zoom In</span>
                  <kbd className="text-xs opacity-70">Ctrl+=</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  onClick={() => zoomOut({ duration: 400 })}
                  className="shadow-lg"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <span>Zoom Out</span>
                  <kbd className="text-xs opacity-70">Ctrl+-</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  onClick={handleTidyUp}
                  className="shadow-lg"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <span>Tidy Up</span>
                  <kbd className="text-xs opacity-70">Ctrl+Shift+T</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  onClick={handleUndo}
                  disabled={historyIndex === 0}
                  className="shadow-lg"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <span>Undo</span>
                  <kbd className="text-xs opacity-70">Ctrl+Z</kbd>
                </div>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon-sm"
                  onClick={handleRedo}
                  disabled={historyIndex === history.length - 1}
                  className="shadow-lg"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="flex flex-col gap-1">
                  <span>Redo</span>
                  <kbd className="text-xs opacity-70">Ctrl+Shift+Z</kbd>
        </div>
              </TooltipContent>
            </Tooltip>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  )
}

export default function PathwayDetailPage({ params }: { params: { id: string } }) {
  return (
    <ReactFlowProvider>
      <FlowEditor params={params} />
    </ReactFlowProvider>
  )
}

