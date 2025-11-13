import { ChartRadialStacked } from "@/components/ui/chart-radial-stacked"
import { ChartBarHorizontal } from "@/components/ui/chart-bar-horizontal"
import { ChartRadarDefault } from "@/components/ui/chart-radar-default"
import { ChartPieSimple } from "@/components/ui/chart-pie-simple"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCharts() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Inbound/Outbound
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex items-center justify-center pb-0">
          <ChartRadialStacked />
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Peak Hours
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex items-center justify-center pb-0">
          <ChartBarHorizontal />
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex items-center justify-center pb-0">
          <ChartRadarDefault />
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Top Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full flex items-center justify-center pb-0">
          <ChartPieSimple />
        </CardContent>
      </Card>
    </div>
  )
}
