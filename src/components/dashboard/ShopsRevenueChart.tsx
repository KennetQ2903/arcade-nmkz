
import {TrendingUp,Store} from "lucide-react"
import {Bar,BarChart,CartesianGrid,XAxis} from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
import {useEffect,useState} from "react"
import {Skeleton} from "../ui/skeleton"

type Data=Array<{total_wholesaler_profit: number,total_retailer_profit: number}>

const chartConfig={
    total_wholesaler_profit: {
        label: "Mayoristas",
        color: "hsl(var(--chart-1))",
    },
    total_retailer_profit: {
        label: "Minoristas",
        color: "hsl(var(--chart-pink))",
    },
} satisfies ChartConfig


export function ShopsRevenueChart() {
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState<Data>([{total_wholesaler_profit: 0,total_retailer_profit: 0}])

    useEffect(() => {
        const getData=async () => {
            setLoading(true)
            const response=await fetch('/api/shops/getShopsProfits')
            const data=await response.json()
            setLoading(false)
            setData(data)
        }
        getData()
    },[])

    if(loading) {
        return <Skeleton className="h-full w-full" />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Store className="h-4 w-4" />
                    Comercios
                </CardTitle>
                <CardDescription>Cobros</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <ChartLegend content={<ChartLegendContent />} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar dataKey="total_wholesaler_profit" fill="var(--color-total_wholesaler_profit)" />
                        <Bar dataKey="total_retailer_profit" fill="var(--color-total_retailer_profit)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Total cobrado por los comercios <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}