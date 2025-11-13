"use client"

import * as React from "react"
import {
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconClockPause,
  IconAlertCircleFilled,
} from "@tabler/icons-react"
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
    cell: ({ row }) => {
      const status = row.original.status
      
      let icon = null
      
      if (status === "Completed") {
        icon = <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400 size-4" />
      } else if (status === "Failed") {
        icon = <IconCircleXFilled className="fill-red-500 dark:fill-red-400 size-4" />
      } else if (status === "Missed") {
        icon = <IconAlertCircleFilled className="fill-yellow-500 dark:fill-yellow-400 size-4" />
      } else if (status === "In Progress") {
        icon = <IconClockPause className="size-4" />
      }
      
      return (
        <div className="flex justify-center">
          <Badge variant="outline" className="text-muted-foreground px-1.5 gap-1">
            {icon}
            {status}
          </Badge>
        </div>
      )
    },
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

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          View
        </Button>
      </DrawerTrigger>
      <DrawerContent direction="right">
        <DrawerHeader className="gap-1">
          <DrawerTitle>Call Details - {item.callId}</DrawerTitle>
          <DrawerDescription>
            Complete information about this call
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="callType">Call Type</Label>
              <Input id="callType" defaultValue={item.callType} readOnly />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="agent">Agent</Label>
                <Input id="agent" defaultValue={item.agent} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="callId">Call ID</Label>
                <Input id="callId" defaultValue={item.callId} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="customer">Customer</Label>
                <Input id="customer" defaultValue={item.customer} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" defaultValue={item.phoneNumber} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="timeStamp">Time Stamp</Label>
                <Input id="timeStamp" defaultValue={item.timeStamp} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" defaultValue={item.duration} readOnly />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="campaign">Campaign</Label>
                <Input id="campaign" defaultValue={item.campaign} readOnly />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Input id="status" defaultValue={item.status} readOnly />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
