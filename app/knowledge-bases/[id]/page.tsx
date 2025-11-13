"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/page-header"
import { 
  ChevronRight, 
  Search, 
  FileText,
  Link as LinkIcon,
  AlignLeft,
  ArrowUpDown,
  Filter,
  FileIcon,
  File,
  Pencil,
  Check,
  X,
  Type,
  Globe,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Dropzone, FileWithPreview } from "@/components/ui/dropzone"
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
import { DocumentTable } from "@/components/document-table"

// Mock data
const mockKnowledgeBase = {
  id: "1",
  name: "Product Documentation",
}

// Mock documents data
const mockDocuments = [
  {
    id: "1",
    name: "Company Policies 2024.pdf",
    description: "Company policies and guidelines for 2024",
    type: "PDF" as const,
    size: "2.4 MB",
    uploadedAt: "2024-01-15",
    status: "ready" as const,
  },
  {
    id: "2", 
    name: "Product Information",
    description: "Detailed product specifications and features",
    type: "Text" as const,
    size: "45 KB",
    uploadedAt: "2024-01-14",
    status: "ready" as const,
  },
  {
    id: "3",
    name: "https://example.com/docs",
    description: "External documentation resource",
    type: "URL" as const,
    size: "-",
    uploadedAt: "2024-01-13",
    status: "processing" as const,
  },
  {
    id: "4",
    name: "User Manual.docx",
    description: "Complete user manual and instructions",
    type: "Document" as const,
    size: "1.8 MB",
    uploadedAt: "2024-01-12",
    status: "ready" as const,
  },
  {
    id: "5",
    name: "FAQs.txt",
    description: "Frequently asked questions",
    type: "Text" as const,
    size: "12 KB",
    uploadedAt: "2024-01-11",
    status: "error" as const,
  },
]

export default function KnowledgeBasePage() {
  const params = useParams()
  const router = useRouter()
  const [fileName, setFileName] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([])
  const [urlInput, setUrlInput] = useState("")
  const [textInput, setTextInput] = useState("")
  const [textKnowledgeBaseName, setTextKnowledgeBaseName] = useState("")
  const [textDescription, setTextDescription] = useState("")
  const [activeTab, setActiveTab] = useState("upload")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [filterType, setFilterType] = useState("all")
  const [hasKnowledgeBases, setHasKnowledgeBases] = useState(true) // Toggle to true to show documents list
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingDescription, setIsEditingDescription] = useState(false)
  const [editableTitle, setEditableTitle] = useState("Knowledge Base")
  const [editableDescription, setEditableDescription] = useState("Manage your knowledge base content")

  const handleFileDrop = (files: FileWithPreview[]) => {
    setSelectedFiles(files)
    if (files.length > 0 && !fileName) {
      // Auto-fill filename from first file
      setFileName(files[0].name.replace(/\.[^/.]+$/, ""))
    }
  }

  const handleUpload = () => {
    // Handle upload logic here
    console.log("Uploading files:", selectedFiles)
    console.log("File name:", fileName)
    
    // Reset
    setFileName("")
    setSelectedFiles([])
    setHasKnowledgeBases(true) // After upload, show list instead of empty state
  }

  const handleAddUrl = () => {
    // Handle URL addition logic here
    console.log("Adding URL:", urlInput)
    
    // Reset
    setUrlInput("")
    setHasKnowledgeBases(true)
  }

  const handleSaveText = () => {
    // Handle text saving logic here
    console.log("Saving text:", {
      name: textKnowledgeBaseName,
      description: textDescription,
      content: textInput
    })
    
    // Reset
    setTextInput("")
    setTextKnowledgeBaseName("")
    setTextDescription("")
    setHasKnowledgeBases(true)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <PageHeader
        title={
          <div className="flex items-center gap-2">
            <span
              className="cursor-pointer hover:underline"
              onClick={() => router.push("/knowledge-bases")}
            >
              Knowledge Bases
            </span>
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
            <span>{mockKnowledgeBase.name}</span>
          </div>
        }
      />

      {/* Two Column Layout */}
      <div className="flex flex-1 gap-4 min-h-0">
        {/* Left Panel - Knowledge Base List */}
        <div className="flex-1 flex flex-col rounded-lg border bg-background shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Title with Edit */}
                <div className="flex items-center gap-2">
                  {isEditingTitle ? (
                    <>
                      <Input
                        value={editableTitle}
                        onChange={(e) => setEditableTitle(e.target.value)}
                        className="text-2xl font-bold h-auto py-1 px-2"
                        autoFocus
                        onBlur={() => setIsEditingTitle(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingTitle(false)
                          } else if (e.key === 'Escape') {
                            setEditableTitle("Knowledge Base")
                            setIsEditingTitle(false)
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                        onClick={() => setIsEditingTitle(false)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                        onClick={() => {
                          setEditableTitle("Knowledge Base")
                          setIsEditingTitle(false)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold leading-tight">{editableTitle}</h2>
                      <button
                        onClick={() => setIsEditingTitle(true)}
                        className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-4 w-4 shrink-0"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>

                {/* Description with Edit */}
                <div className="flex items-center gap-2">
                  {isEditingDescription ? (
                    <>
                      <Input
                        value={editableDescription}
                        onChange={(e) => setEditableDescription(e.target.value)}
                        className="text-sm h-auto py-1 px-2"
                        autoFocus
                        onBlur={() => setIsEditingDescription(false)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            setIsEditingDescription(false)
                          } else if (e.key === 'Escape') {
                            setEditableDescription("Manage your knowledge base content")
                            setIsEditingDescription(false)
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                        onClick={() => setIsEditingDescription(false)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 shrink-0"
                        onClick={() => {
                          setEditableDescription("Manage your knowledge base content")
                          setIsEditingDescription(false)
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground leading-tight">{editableDescription}</p>
                      <button
                        onClick={() => setIsEditingDescription(true)}
                        className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-4 w-4 shrink-0"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {/* Search, Sort, Filter Controls */}
              <div className="flex items-center gap-3 self-center">
                <div className="relative w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[150px] h-9">
                    <ArrowUpDown className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-[180px] h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="doc">Document</SelectItem>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-6">
            {!hasKnowledgeBases ? (
              // Empty State
              <Empty className="border-0 min-h-[400px]">
                <EmptyHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <EmptyMedia variant="icon">
                      <FileText />
                    </EmptyMedia>
                    <EmptyMedia variant="icon">
                      <Globe />
                    </EmptyMedia>
                    <EmptyMedia variant="icon">
                      <Type />
                    </EmptyMedia>
                  </div>
                  <EmptyTitle>No Documents Yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t uploaded any documents yet. Use the panel on the right to upload files, add links, or create text content.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              // Documents Table View
              <DocumentTable 
                data={mockDocuments}
                onEdit={(id, name, description) => console.log("Edit:", { id, name, description })}
                onDownload={(id) => console.log("Download:", id)}
                onDelete={(id) => console.log("Delete:", id)}
                onBulkDownload={(ids) => console.log("Bulk download:", ids)}
                onBulkDelete={(ids) => console.log("Bulk delete:", ids)}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Upload Form (Always Visible) */}
        <div className="w-[420px] flex flex-col rounded-lg border bg-background shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b flex items-start">
            <div className="space-y-1">
              <h3 className="text-xl font-semibold">Update Knowledge Base</h3>
              <p className="text-sm text-muted-foreground">
              Add content so your AI agent can learn from it.
              </p>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="upload" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="link" className="flex-1">
                  <Globe className="h-4 w-4 mr-2" />
                  Add Link
                </TabsTrigger>
                <TabsTrigger value="text" className="flex-1">
                  <Type className="h-4 w-4 mr-2" />
                  Create Text
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-6 mt-6">
                <div className="space-y-3">
                  <Label htmlFor="file-name">File Name</Label>
                  <Input
                    id="file-name"
                    placeholder="Text input"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Dropzone
                    onDrop={handleFileDrop}
                    accept={{
                      'application/pdf': ['.pdf'],
                      'text/plain': ['.txt'],
                      'text/csv': ['.csv'],
                      'application/msword': ['.doc'],
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                    }}
                    maxSize={100 * 1024 * 1024} // 100 MB
                    maxFiles={5}
                    showPreview={true}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground text-center">
                    Supported formats: .pdf, .txt, .doc, .docx, .csv
                  </p>
                  <p className="text-xs text-muted-foreground text-center">
                    Max file size: 100 MB
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="link" className="space-y-6 mt-6">
                <div className="space-y-3">
                  <Label htmlFor="url-input">URL</Label>
                  <Input
                    id="url-input"
                    type="url"
                    placeholder="https://example.com"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter a URL to a PDF, audio file, video, or webpage
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-6 mt-6">
                <div className="space-y-6">
                  {/* Knowledge Base Name */}
                  <div className="space-y-3">
                    <Label htmlFor="text-kb-name" className="text-sm font-medium">
                      Knowledge Base Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="text-kb-name"
                      placeholder="e.g., Company Policies, Product Information"
                      value={textKnowledgeBaseName}
                      onChange={(e) => setTextKnowledgeBaseName(e.target.value)}
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <Label htmlFor="text-description" className="text-sm font-medium">
                      Description <span className="text-muted-foreground font-normal">(Optional)</span>
                    </Label>
                    <Textarea
                      id="text-description"
                      placeholder="Describe what this content is about..."
                      value={textDescription}
                      onChange={(e) => setTextDescription(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <Label htmlFor="text-input" className="text-sm font-medium">
                      Text Content <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="text-input"
                      placeholder="Paste or type your content here..."
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      className="min-h-[250px] resize-none font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can paste any text content here - policies, FAQs, documentation, or any other text-based information.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer with Action Button */}
          <div className="p-6 border-t mt-auto">
            {activeTab === "upload" && (
              <Button 
                onClick={handleUpload} 
                disabled={selectedFiles.length === 0}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white"
                size="lg"
              >
                Upload
              </Button>
            )}
            {activeTab === "link" && (
              <Button 
                onClick={handleAddUrl} 
                disabled={!urlInput}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white"
                size="lg"
              >
                Add URL
              </Button>
            )}
            {activeTab === "text" && (
              <Button 
                onClick={handleSaveText} 
                disabled={!textInput || !textKnowledgeBaseName}
                className="w-full bg-[#F59E0B] hover:bg-[#D97706] text-white"
                size="lg"
              >
                Create Knowledge Base
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

