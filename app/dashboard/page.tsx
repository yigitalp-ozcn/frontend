"use client"

import { PageHeader } from "@/components/page-header"
import { DataTable } from "@/components/call-table"
import { Separator } from "@/components/ui/separator"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import mockData from "@/lib/mock-data.json"

export default function Page() {
  const { callData } = mockData

  return (
    <div className="@container/main flex flex-1 flex-col gap-6 p-4">
      <PageHeader title="Dashboard">
        <DateRangePicker className="w-auto" />
      </PageHeader>

      {/* Section Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Area */}
      <Card className="py-3 sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-3 sm:px-6 sm:py-0">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-3 w-64 mt-1" />
          </div>
          <div className="flex">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex flex-1 flex-col justify-center gap-1 border-t px-4 py-3 even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-4"
              >
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </CardHeader>
        <CardContent className="px-2 py-3 sm:px-6 sm:py-4">
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </CardContent>
      </Card>

      {/* Section Charts */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="w-full flex items-center justify-center pb-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Recent Activities</h2>
          <Separator className="flex-1" />
          <Link href="/call-logs">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>
        <DataTable data={callData} defaultPageSize={5} />
      </div>
    </div>
  )
}
