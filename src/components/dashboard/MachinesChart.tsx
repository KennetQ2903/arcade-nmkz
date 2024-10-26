
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
import {Joystick,Wrench} from "lucide-react"
import {Bar,BarChart,CartesianGrid} from "recharts"
import {Skeleton} from "../ui/skeleton"
import {useEffect,useState} from "react"

type Data=Array<{total_active_machines: number,total_inactive_machines: number}>


const chartConfig={
    total_active_machines: {
        label: "Operacionales",
        color: "hsl(var(--chart-1))",
    },
    total_inactive_machines: {
        label: "Con problemas",
        color: "hsl(var(--chart-pink))",
    },
} satisfies ChartConfig

export function MachinesChart() {
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState<Data>([{total_active_machines: 0,total_inactive_machines: 0}])

    useEffect(() => {
        const getData=async () => {
            setLoading(true)
            const response=await fetch('/api/arcades/getActiveMachines')
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
                    <Joystick className="h-4 w-4" />
                    Arcades
                </CardTitle>
                <CardDescription>Maquinas</CardDescription>
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
                        <Bar dataKey="total_active_machines" fill="var(--color-total_active_machines)" />
                        <Bar dataKey="total_inactive_machines" fill="var(--color-total_inactive_machines)" />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                    Total de maquinas operacionales <Wrench className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}