import {useEffect,useState} from "react"
import {OnlyNumberChart} from "../common/OnlyNumberChart"
import {Skeleton} from "../ui/skeleton"

export const TicketsChart=() => {
    const [loading,setLoading]=useState(true)
    const [data,setData]=useState<Array<{total: number}>>([{total: 0}])

    useEffect(() => {
        const getData=async () => {
            setLoading(true)
            const response=await fetch('/api/repairs/getCountOfTickets')
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
            title="Tickets"
            description="Total de tickets abiertos"
            dataKey="total"
            legend="Tickets"
            chartData={data}
            chartConfig={{total: {label: "Total"}}}
            fill="hsl(var(--chart-pink))"
        />
    )
}