"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClockPause,
} from "@tabler/icons-react"
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Download,
  X,
} from "lucide-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Message, MessageContent } from "@/components/ui/message"
import { Response } from "@/components/ui/response"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export const schema = z.object({
  id: z.number(),
  callType: z.string(),
  agent: z.string(),
  callId: z.string(),
  customer: z.string(),
  phoneNumber: z.string(),
  timeStamp: z.string(),
  duration: z.string(),
  status: z.string(),
  campaign: z.string(),
})

// Extract status icon logic for reusability
const getStatusIcon = (status: string) => {
  switch (status) {
    case "Completed":
      return <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 size-4" />
    case "Failed":
      return <IconCircleXFilled className="fill-red-500 dark:fill-red-400 size-4" />
    case "In Progress":
      return <IconClockPause className="size-4" />
    default:
      return null
  }
}

// Pre-calculate waveform bar heights - static data that never changes
const WAVEFORM_BARS = Array.from({ length: 140 }).map((_, i) => ({
  height: Math.sin(i * 0.2) * 20 + (Math.sin(i * 0.7) * 7) + 18,
  index: i,
}))

// Move columns outside component to prevent recreation on every render
const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    accessorKey: "callType",
    header: () => <div className="text-center">Call Type</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="text-muted-foreground px-1.5 w-20 justify-center">
          {row.original.callType}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "agent",
    header: () => <div className="text-center">Agent</div>,
    cell: ({ row }) => <div className="text-center">{row.original.agent}</div>,
  },
  {
    accessorKey: "callId",
    header: () => <div className="text-center">Call ID</div>,
    cell: ({ row }) => <div className="font-mono text-center">{row.original.callId}</div>,
  },
  {
    accessorKey: "customer",
    header: () => <div className="text-center">Customer</div>,
    cell: ({ row }) => <div className="text-center">{row.original.customer}</div>,
  },
  {
    accessorKey: "phoneNumber",
    header: () => <div className="text-center">Phone Number</div>,
    cell: ({ row }) => (
      <div className="font-mono text-center">{row.original.phoneNumber}</div>
    ),
  },
  {
    accessorKey: "campaign",
    header: () => <div className="text-center">Campaign</div>,
    cell: ({ row }) => <div className="text-center text-sm">{row.original.campaign}</div>,
  },
  {
    accessorKey: "timeStamp",
    header: () => <div className="text-center">Time Stamp</div>,
    cell: ({ row }) => <div className="text-center">{row.original.timeStamp}</div>,
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-center">Duration</div>,
    cell: ({ row }) => <div className="text-center">{row.original.duration}</div>,
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1">
          {getStatusIcon(row.original.status)}
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    id: "details",
    header: () => <div className="text-center">Details</div>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <TableCellViewer item={row.original} />
      </div>
    ),
  },
]

export function DataTable({
  data,
  defaultPageSize = 10,
}: {
  data: z.infer<typeof schema>[]
  defaultPageSize?: number
}) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground text-sm">
          Showing {table.getRowModel().rows.length > 0 ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} rows
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium whitespace-nowrap">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <IconChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <IconChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Duration string'i saniyeye çevir (örn: "3:45" -> 225)
function parseDuration(duration: string): number {
  const parts = duration.split(':').map(Number)
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1]
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  }
  return 0
}

// Saniyeyi süre formatına çevir (örn: 125 -> "2:05")
function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  // Waveform disabled durumları
  const isWaveformDisabled = ["Failed", "In Progress"].includes(item.status)

  // Toplam süre (saniye)
  const totalDuration = parseDuration(item.duration)

  // Mevcut süre (progress'e göre)
  const currentTime = (progress / 100) * totalDuration

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" disabled={isWaveformDisabled}>
          View
        </Button>
      </DrawerTrigger>
      <DrawerContent direction="right" className="w-[950px]" data-vaul-no-drag>
        <div className="flex h-full flex-col" data-vaul-no-drag>
          {/* Ana İçerik - 2 Kolon */}
          <div className="flex min-h-0 flex-1">
            {/* Sol Kolon - Agent Bilgisi */}
            <div className="flex w-[280px] shrink-0 flex-col border-r">
              {/* Kapatma Butonu */}
              <div className="flex items-center p-3">
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <IconChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </Button>
                </DrawerClose>
              </div>

              {/* Agent Orb ve İsmi */}
              <div className="flex flex-col items-center gap-3 px-4 py-4">
                <div className="bg-muted relative h-20 w-20 rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
                  <div className="bg-background flex h-full w-full items-center justify-center overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
                    <span className="text-muted-foreground text-xl font-semibold">
                      {item.agent.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{item.agent}</p>
                </div>
              </div>

              {/* Arama Bilgileri */}
              <div className="flex-1 space-y-0.5 overflow-y-auto px-4 py-4 text-sm">
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground text-xs">From</span>
                  <span className="font-mono text-xs">+1 (555) 000-0000</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground text-xs">To</span>
                  <span className="font-mono text-xs">{item.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground text-xs">Time Stamp</span>
                  <span className="text-xs">{item.timeStamp}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground text-xs">Duration</span>
                  <span className="text-xs font-medium">{item.duration}</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground text-xs">Call Type</span>
                  <Badge variant="outline" className="h-5 text-[10px]">{item.callType}</Badge>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground text-xs">Cost</span>
                  <span className="text-xs font-medium">$0.12</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-muted-foreground text-xs">Status</span>
                  <Badge variant="outline" className="h-5 gap-1 text-[10px]">
                    {getStatusIcon(item.status)}
                    {item.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Sağ Kolon - Tabs */}
            <div className="flex min-w-0 flex-1 flex-col">
              <Tabs defaultValue="transcript" className="flex h-full flex-col">
                <div className="shrink-0 px-4 pt-4">
                  <TabsList className="w-full">
                    <TabsTrigger value="transcript" className="flex-1">Transcript</TabsTrigger>
                    <TabsTrigger value="summary" className="flex-1">Summary</TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="transcript" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col gap-1">
                    <Message from="assistant" className="py-2">
                      <MessageContent variant="contained" className="max-w-[85%]">
                        <Response className="text-sm whitespace-pre-wrap break-words">
                          Hello! Thank you for calling. How can I assist you today?
                        </Response>
                      </MessageContent>
                      <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">AI</AvatarFallback>
                      </Avatar>
                    </Message>

                    <Message from="user" className="py-2">
                      <MessageContent variant="contained" className="max-w-[85%]">
                        <Response className="text-sm whitespace-pre-wrap break-words">
                          Hi, I&apos;d like to inquire about my recent order status.
                        </Response>
                      </MessageContent>
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">C</AvatarFallback>
                      </Avatar>
                    </Message>

                    <Message from="assistant" className="py-2">
                      <MessageContent variant="contained" className="max-w-[85%]">
                        <Response className="text-sm whitespace-pre-wrap break-words">
                          Of course! I&apos;d be happy to help you with that. Could you please provide me with your order number?
                        </Response>
                      </MessageContent>
                      <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">AI</AvatarFallback>
                      </Avatar>
                    </Message>

                    <Message from="user" className="py-2">
                      <MessageContent variant="contained" className="max-w-[85%]">
                        <Response className="text-sm whitespace-pre-wrap break-words">
                          Sure, it&apos;s order number 12345.
                        </Response>
                      </MessageContent>
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">C</AvatarFallback>
                      </Avatar>
                    </Message>

                    <Message from="assistant" className="py-2">
                      <MessageContent variant="contained" className="max-w-[85%]">
                        <Response className="text-sm whitespace-pre-wrap break-words">
                          Thank you! I can see your order #12345 is currently being processed and will be shipped tomorrow. You should receive a tracking number via email within 24 hours.
                        </Response>
                      </MessageContent>
                      <Avatar className="h-7 w-7 shrink-0 ring-1 ring-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">AI</AvatarFallback>
                      </Avatar>
                    </Message>

                    <Message from="user" className="py-2">
                      <MessageContent variant="contained" className="max-w-[85%]">
                        <Response className="text-sm whitespace-pre-wrap break-words">
                          That&apos;s great, thank you so much for your help!
                        </Response>
                      </MessageContent>
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">C</AvatarFallback>
                      </Avatar>
                    </Message>
                  </div>
                </TabsContent>

                <TabsContent value="summary" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Call Summary</h4>
                      <p className="text-muted-foreground text-sm">
                        Customer called to inquire about their recent order status. The agent assisted with tracking information and confirmed delivery date.
                      </p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Key Points</h4>
                      <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                        <li>Order #12345 confirmed</li>
                        <li>Expected delivery: Tomorrow</li>
                        <li>Customer satisfied with resolution</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 text-sm font-medium">Sentiment</h4>
                      <Badge variant="outline" className="bg-green-500/10 text-green-600">Positive</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="mt-0 min-h-0 flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {/* Add Note Section */}
                    <div>
                      <Label htmlFor="notes" className="text-muted-foreground mb-2 block text-xs">Add notes about this call</Label>
                      <textarea
                        id="notes"
                        placeholder="Write your notes here..."
                        className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full resize-none rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button size="sm">Save Notes</Button>
                    </div>

                    {/* Existing Notes */}
                    <div className="space-y-3 pt-2">
                      <Label className="text-muted-foreground block text-xs">Saved Notes</Label>

                      {/* Note Card 1 */}
                      <div className="group relative rounded-lg border bg-card p-3">
                        <button className="absolute right-2 top-2 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Delete note</span>
                        </button>
                        <p className="pr-6 text-sm">Customer requested expedited shipping. Escalated to supervisor for approval.</p>
                        <p className="text-muted-foreground mt-2 text-xs">Added by John D. - 2 hours ago</p>
                      </div>

                      {/* Note Card 2 */}
                      <div className="group relative rounded-lg border bg-card p-3">
                        <button className="absolute right-2 top-2 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Delete note</span>
                        </button>
                        <p className="pr-6 text-sm">Follow-up call scheduled for tomorrow at 2 PM to confirm delivery.</p>
                        <p className="text-muted-foreground mt-2 text-xs">Added by Sarah M. - Yesterday</p>
                      </div>

                      {/* Note Card 3 */}
                      <div className="group relative rounded-lg border bg-card p-3">
                        <button className="absolute right-2 top-2 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100">
                          <X className="h-4 w-4" />
                          <span className="sr-only">Delete note</span>
                        </button>
                        <p className="pr-6 text-sm">VIP customer - priority handling required for all future orders.</p>
                        <p className="text-muted-foreground mt-2 text-xs">Added by Admin - 3 days ago</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Alt Kısım - Audio Player (Full Width) */}
          <div className="shrink-0 border-t">
            <div className="p-4">
              {/* Full Width Waveform */}
              <div className={`relative mb-4 ${isWaveformDisabled ? 'opacity-40 pointer-events-none' : ''}`}>
                <div className="flex h-12 w-full items-end gap-[2px]">
                  {WAVEFORM_BARS.map(({ height, index }) => (
                    <div
                      key={index}
                      className={`flex-1 rounded-sm transition-all duration-100 ${
                        index < (progress * 1.4) ? 'bg-primary' : 'bg-muted-foreground/20'
                      }`}
                      style={{ height: `${height}px` }}
                    />
                  ))}
                </div>
                {/* Invisible Slider Overlay */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  disabled={isWaveformDisabled}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
                />
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between">
                {/* Time Display */}
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-foreground tabular-nums font-medium">{formatTime(currentTime)}</span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-muted-foreground tabular-nums">{item.duration}</span>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    disabled={isWaveformDisabled}
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="sr-only">Rewind 10s</span>
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setIsPlaying(!isPlaying)}
                    disabled={isWaveformDisabled}
                  >
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 ml-0.5" />
                    )}
                    <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    disabled={isWaveformDisabled}
                  >
                    <RotateCw className="h-4 w-4" />
                    <span className="sr-only">Forward 10s</span>
                  </Button>
                </div>

                {/* Download Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  disabled={isWaveformDisabled}
                >
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Download</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
