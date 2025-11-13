"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type ChartData = {
  date: string
  calls: number
  cost: number
  duration: number
}

interface ChartAreaInteractiveProps {
  data: ChartData[]
}

const chartConfig = {
  metrics: {
    label: "Call Metrics",
  },
  calls: {
    label: "Total Calls",
    color: "var(--chart-1)",
  },
  cost: {
    label: "Total Cost",
    color: "var(--chart-2)",
  },
  duration: {
    label: "AVG Duration",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export const ChartAreaInteractive = React.memo(function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("calls")

  const total = React.useMemo(
    () => ({
      calls: data.reduce((acc, curr) => acc + curr.calls, 0),
      cost: data.reduce((acc, curr) => acc + curr.cost, 0),
      duration: data.length > 0 ? data.reduce((acc, curr) => acc + curr.duration, 0) / data.length : 0,
    }),
    [data]
  )

  const formatValue = (key: string, value: number) => {
    if (key === "cost") return `$${value.toLocaleString()}`
    if (key === "duration") return `${value.toFixed(1)}`
    return value.toLocaleString()
  }

  return (
    <Card className="py-3 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-0.5 px-4 py-3 sm:px-6 sm:py-0">
          <CardTitle className="text-base sm:text-lg">Call Analytics</CardTitle>
          <CardDescription className="text-xs">
            Here's everything you need to know about your calls.
          </CardDescription>
        </div>
        <div className="flex">
          {["calls", "cost", "duration"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-0.5 border-t px-4 py-3 text-left even:border-l sm:border-t-0 sm:border-l sm:px-6 sm:py-4"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-[10px] sm:text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-base leading-none font-bold sm:text-2xl">
                  {formatValue(key, total[key as keyof typeof total])}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 py-3 sm:px-6 sm:py-4">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="metrics"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
})
