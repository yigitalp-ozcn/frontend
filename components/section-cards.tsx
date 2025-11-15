import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Data-driven approach - consolidate repetitive card structure
const statsCards = [
  {
    label: "Active Agents",
    value: "10",
    trend: { value: "+25%", direction: "up" as const },
    description: "Growing agent network",
    subtitle: "All agents operational and ready",
  },
  {
    label: "Pending Calls",
    value: "134",
    trend: { value: "-15%", direction: "down" as const },
    description: "Queue improving",
    subtitle: "Processing efficiency increased",
  },
  {
    label: "Answer Rate",
    value: "64%",
    trend: { value: "+12.5%", direction: "up" as const },
    description: "Trending up this month",
    subtitle: "Higher engagement from contacts",
  },
  {
    label: "Success Rate",
    value: "54%",
    trend: { value: "+4.5%", direction: "up" as const },
    description: "Steady performance increase",
    subtitle: "Conversion goals on track",
  },
] as const

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4">
      {statsCards.map((stat) => {
        const TrendIcon = stat.trend.direction === "up" ? IconTrendingUp : IconTrendingDown
        return (
          <Card key={stat.label} className="@container/card">
            <CardHeader>
              <CardDescription>{stat.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {stat.value}
              </CardTitle>
              <CardAction>
                <Badge variant="outline">
                  <TrendIcon />
                  {stat.trend.value}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {stat.description} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                {stat.subtitle}
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
