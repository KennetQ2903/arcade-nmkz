import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {ChartContainer} from "@/components/ui/chart"
import {useEffect,useState} from "react"


interface Props<T> {
    title: string
    description: string
    dataKey: string
    legend: string
    chartData: T[]
    chartConfig: {
        [k in keyof Omit<T,'fill'>]: {
            label?: string
            color?: string
        }
    }
    fill?: string
}


export function OnlyNumberChart<K>({description,title,dataKey,legend,chartData,chartConfig,fill="hsl(var(--chart-1))"}: Props<K>) {
    const [data,setData]=useState<K[]>([])

    useEffect(() => {
        if(chartData.length) {
            const newData=chartData.map(item => ({
                ...item,
                fill,
            }))
            setData(newData)
        }
    },[fill])

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <RadialBarChart
                        data={data}
                        startAngle={0}
                        endAngle={250}
                        innerRadius={80}
                        outerRadius={110}
                    >
                        <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[86,74]}
                        />
                        <RadialBar dataKey={dataKey} background cornerRadius={10} />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({viewBox}) => {
                                    if(viewBox&&"cx" in viewBox&&"cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="dark:fill-white fill-foreground text-4xl font-bold"
                                                >
                                                    {data[0][dataKey as keyof K]?.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy||0)+24}
                                                    className="dark:fill-white fill-muted-foreground"
                                                >
                                                    {legend}
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
