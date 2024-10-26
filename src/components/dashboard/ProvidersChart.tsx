import {useEffect,useState} from "react"
import {OnlyNumberChart} from "../common/OnlyNumberChart"
import {Skeleton} from "../ui/skeleton"

export const ProvidersChart=() => {
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState<Array<{total: number}>>([{total: 0}])

    useEffect(() => {
        const getData=async () => {
            setLoading(true)
            const response=await fetch('/api/providers/getCountOfProviders')
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
        <OnlyNumberChart
            title="Proveedores"
            description="Total de proveedores"
            dataKey="total"
            legend="Proveedores"
            chartData={data}
            chartConfig={{total: {label: "Total"}}}
            fill="hsl(var(--chart-1))"
        />
    )
}