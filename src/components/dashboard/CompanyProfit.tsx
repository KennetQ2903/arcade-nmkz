"use client"

import * as React from "react"
import {CartesianGrid,Line,LineChart,XAxis} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {formatCurrency} from "@/lib/formatCurrency"
import {Skeleton} from "../ui/skeleton"

type MonthlyData=Array<{
    revenue_month: Date,
    total_revenue: number
    total_company_revenue: number
    total_shop_revenue: number
}>

type TotalsData={
    total_revenue: number
    total_company_profit: number
    total_shops_profit: number
    total_shops: number
}

const chartConfig={
    total_company_revenue: {
        label: "Ganancias de la empresa",
        color: "hsl(var(--chart-1))",
    },
    total_shop_revenue: {
        label: "Ganancias de los comercios",
        color: "hsl(var(--chart-pink))",
    },
} satisfies ChartConfig

export function CompanyProfit() {
    const [loading,setLoading]=React.useState(true)
    const [data,setData]=React.useState<MonthlyData>([])
    const [totals,setTotals]=React.useState<TotalsData>({
        total_revenue: 0,
        total_company_profit: 0,
        total_shops_profit: 0,
        total_shops: 0,
    })

    React.useEffect(() => {
        const getData=async () => {
            setLoading(true)
            const response=await fetch('/api/analytics/getMonthlyRevenues')
            const data=await response.json()
            const totals=await fetch('/api/analytics/getTotals')
            const totalsData=await totals.json()
            setLoading(false)
            setData(data)
            setTotals(totalsData)
        }
        getData()
    },[])

    if(loading) {
        <Skeleton className="h-full w-full" />
    }

    return (
        <Card>
            <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
                <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
                    <CardTitle>Ganancias</CardTitle>
                    <CardDescription>
                        Total de ganancias recaudadas por los comercios
                    </CardDescription>
                </div>
                <div className="flex">
                    <article
                        className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    >
                        <span className="text-xs text-muted-foreground">
                            Total Recaudado
                        </span>
                        <span className="text-lg font-bold leading-none sm:text-3xl">
                            {formatCurrency(totals.total_revenue)}
                        </span>
                    </article>
                    <article
                        className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    >
                        <span className="text-xs text-muted-foreground">
                            Ganancias para la empresa
                        </span>
                        <span className="text-lg font-bold leading-none sm:text-3xl">
                            {formatCurrency(totals.total_company_profit)}
                        </span>
                    </article>
                    <article
                        className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    >
                        <span className="text-xs text-muted-foreground">
                            Ganancias para los comercios
                        </span>
                        <span className="text-lg font-bold leading-none sm:text-3xl">
                            {formatCurrency(totals.total_shops_profit)}
                        </span>
                    </article>
                    <article
                        className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    >
                        <span className="text-xs text-muted-foreground">
                            Comercios en total
                        </span>
                        <span className="text-lg font-bold leading-none sm:text-3xl text-center">
                            {totals.total_shops}
                        </span>
                    </article>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
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
                            dataKey="revenue_month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date=new Date(value)
                                return date.toLocaleDateString("es-GT",{
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("es-GT",{
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Line
                            dataKey={'total_company_revenue'}
                            type="monotone"
                            stroke={`var(--color-total_company_revenue)`}
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            dataKey={'total_shop_revenue'}
                            type="monotone"
                            stroke={`var(--color-total_shop_revenue)`}
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
