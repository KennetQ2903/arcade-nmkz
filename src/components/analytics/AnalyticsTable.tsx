import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {formatCurrency} from "@/lib/formatCurrency"
import {supabaseAnon} from "@/lib/supabaseAnon"
import {createColumnHelper,flexRender,getCoreRowModel,useReactTable} from "@tanstack/react-table"
import {format} from "date-fns"
import React from "react"
import {toast} from "sonner"
import {TableSkeleton} from "../common/TableSkeleton"
import {useDownloadPDF} from "@/hooks/useDownloadPDF"
import {GenerateResumenButton} from "./GenerateResumenButton"
import {FileLineChart} from "lucide-react"



const columnHelper=createColumnHelper<IRevenue>()

const columns=[
    columnHelper.accessor('id',{
        id: 'id',
        cell: info => info.getValue(),
        header: '#',
    }),
    columnHelper.accessor('recorded_at',{
        id: 'recorded_at',
        header: 'Ingresado el',
        cell: info => format(info.getValue(),'dd-MM-yyyy HH:mm a'),
    }),
    columnHelper.accessor('machine_serial',{
        id: 'machine_serial',
        cell: info => info.getValue(),
        header: 'Maquina',
    }),
    columnHelper.accessor('shop',{
        id: 'shop',
        cell: info => info.getValue(),
        header: 'Comercio',
    }),
    columnHelper.accessor('total_amount',{
        id: 'total_amount',
        header: 'Total recaudado',
        cell: info => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('shop_revenue',{
        id: 'shop_revenue',
        header: 'Venta de comercio',
        cell: info => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor('company_revenue',{
        id: 'company_revenue',
        header: 'Ingreso de la empresa',
        cell: info => formatCurrency(info.getValue()),
    }),
]


export const AnalyticsTable: React.FC=() => {
    const {handleDownload,tableRef}=useDownloadPDF()
    const [loading,setLoading]=React.useState(true)
    const [revenues,setRevenues]=React.useState<IRevenue[]>([])
    const table=useReactTable({
        data: revenues,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const getRevenues=React.useCallback(async () => {
        setLoading(true)
        return fetch('/api/analytics/getAllRevenues',{
            method: 'GET'
        })
            .then(res => {
                if(res.ok) {
                    return res.json()
                } else {
                    throw new Error('Error getting revenues')
                }
            })
            .then(setRevenues)
            .catch(() => {
                toast.error('Ocurrió un error al obtener las recaudaciones')
            })
            .finally(() => setLoading(false))
    },[])

    React.useEffect(() => {
        const getData=async () => {
            await getRevenues()
        }
        getData()
    },[])

    React.useEffect(() => {
        const channel=supabaseAnon
            .channel('revenues-channel')
            .on(
                'postgres_changes',
                {event: '*',schema: 'public',table: 'revenues'},
                async () => {
                    await getRevenues()
                }
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
            supabaseAnon.removeChannel(channel)
        }
    },[getRevenues])

    if(loading) {
        return <TableSkeleton />
    }

    return (
        <>
            <div className="flex justify-end mb-6">
                <GenerateResumenButton onClick={handleDownload} title="Generar resumen">
                    <FileLineChart className="w-6 h-6" />
                </GenerateResumenButton>
            </div>
            <Table ref={tableRef}>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <TableHead key={header.id} className="hidden md:table-cell">
                                    {flexRender(header.column.columnDef.header,header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map(row => (
                        <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <TableCell className="hidden md:table-cell" key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell,cell.getContext())}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    )
}