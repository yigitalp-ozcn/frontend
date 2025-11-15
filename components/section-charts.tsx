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

// Data-driven approach - consolidate repetitive chart cards
const chartCards = [
  { title: "Inbound/Outbound", Component: ChartRadialStacked },
  { title: "Peak Hours", Component: ChartBarHorizontal },
  { title: "Sentiment Analysis", Component: ChartRadarDefault },
  { title: "Top Agents", Component: ChartPieSimple },
]

export function SectionCharts() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
      {chartCards.map(({ title, Component }) => (
        <Card key={title} className="@container/card">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              {title}
            </CardTitle>
          </CardHeader>
          <CardContent className="w-full flex items-center justify-center pb-0">
            <Component />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
