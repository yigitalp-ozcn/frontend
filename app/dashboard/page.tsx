import { Button } from "@/components/ui/button"
import { CircleFadingPlus, Edit } from "lucide-react"
import { PageHeader } from "@/components/page-header"
import { SectionCards } from "@/components/section-cards"
import { ChartAreaInteractive } from "@/components/chart-area"
import { SectionCharts } from "@/components/section-charts"
import { DataTable } from "@/components/call-table"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import mockData from "@/lib/mock-data.json"

export default function Page() {
  const { chartData, callData } = mockData
  
  return (
    <div className="@container/main flex flex-1 flex-col gap-6 p-4">
      <PageHeader title="Dashboard">
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Flow
        </Button>
        <Button variant="default" size="sm" className="gap-2">
          <CircleFadingPlus className="h-4 w-4" />
          Create Path
        </Button>
      </PageHeader>
      <SectionCards />
      <ChartAreaInteractive data={chartData} />
      <SectionCharts />
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
