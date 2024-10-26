import {createColumnHelper,flexRender,getCoreRowModel,useReactTable} from "@tanstack/react-table"
import {format} from "date-fns"
import {ContextMenu} from "./ContextMenu"
import React,{useCallback} from "react"
import {toast} from "sonner"
import {TableSkeleton} from "../common/TableSkeleton"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {supabaseAnon} from "@/lib/supabaseAnon"
import {formatCurrency} from "@/lib/formatCurrency"

const columnHelper=createColumnHelper<IShop>()

const columns=[
    columnHelper.accessor('name',{
        id: 'name',
        cell: info => info.getValue(),
        header: 'Nombre',
    }),
    columnHelper.accessor('phone',{
        id: 'phone',
        header: 'Telefono',
        cell: info => info.getValue()??'N/A',
    }),
    columnHelper.accessor('last_negotiation_date',{
        id: 'last_negotiation_date',
        header: 'Ultima negociación',
        cell: info => format(info.getValue(),'dd-MM-yyyy'),
    }),
    columnHelper.accessor('localidad',{
        id: 'localidad',
        header: 'Localidad',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('direccion_completa',{
        id: 'direccion_completa',
        header: 'Direccion',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('type',{
        id: 'type',
        header: 'Tipo de comercio',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('fixed_amount',{
        id: 'fixed_amount',
        header: 'Cantidad Fija',
        cell: info => info?.getValue()? formatCurrency(info.getValue()):'N/A',
    }),
    columnHelper.accessor('percentage',{
        id: 'percentage',
        header: 'Porcentaje',
        cell: info => info?.getValue()? `${info.getValue()}%`:'N/A',
    }),
    columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => <ContextMenu info={info} />,
    })
]

export const ShopsTable: React.FC=() => {
    const [loading,setLoading]=React.useState(true)
    const [shops,setShops]=React.useState<IShop[]>([])
    const table=useReactTable({
        data: shops,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleGetData=useCallback(async () => {
        setLoading(true)
        return fetch('/api/shops/getAllShops',{
            method: 'GET'
        })
            .then(res => {
                if(res.ok) {
                    return res.json()
                } else {
                    throw new Error('Error getting shops')
                }
            })
            .then(setShops)
            .catch(() => {
                toast.error('Ocurrió un error al obtener los comercios')
            })
            .finally(() => setLoading(false))
    },[])

    React.useEffect(() => {
        const getData=async () => {
            await handleGetData()
        }
        getData()
    },[])

    React.useEffect(() => {
        const channel=supabaseAnon
            .channel('shops-channel')
            .on(
                'postgres_changes',
                {event: '*',schema: 'public',table: 'shops'},
                (payload) => {
                    if(payload.eventType==='INSERT') {
                        setShops(p => [...p,payload.new as IShop])
                    }
                    else if(payload.eventType==='UPDATE') {
                        setShops(p => p.map(shop => {
                            if(shop.id===payload.new?.id) {
                                const newShop=payload.new as IProvider
                                return {
                                    ...shop,
                                    ...newShop
                                }
                            }
                            return shop
                        }))
                    }
                    else if(payload.eventType==='DELETE') {
                        setShops(p => p.filter(s => s.id!==payload.old.id))
                    }
                }
            )
            .subscribe()

        return () => {
            channel.unsubscribe()
            supabaseAnon.removeChannel(channel)
        }
    },[])

    if(loading) {
        return <TableSkeleton />
    }


    return (
        <Table>
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
    )
}