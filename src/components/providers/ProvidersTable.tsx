import {supabaseAnon} from "@/lib/supabaseAnon"
import React from "react"
import {toast} from "sonner"
import {TableSkeleton} from "../common/TableSkeleton"
import {createColumnHelper,flexRender,getCoreRowModel,useReactTable} from "@tanstack/react-table"
import {ContextMenu} from "./ContextMenu"
import {format} from "date-fns"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"

const columnHelper=createColumnHelper<IProvider>()

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
    columnHelper.accessor('created_at',{
        id: 'created_at',
        header: 'Creado el',
        cell: info => format(info.getValue(),'dd-MM-yyyy HH:mm:ss'),
    }),
    columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => <ContextMenu info={info} />,
    })
]

export const ProvidersTable: React.FC=() => {
    const [loading,setLoading]=React.useState(true)
    const [providers,setProviders]=React.useState<IProvider[]>([])
    const table=useReactTable({
        data: providers,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    React.useEffect(() => {
        const getProviders=async () => {
            setLoading(true)
            return fetch('/api/providers/getAllProviders',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        toast.success('Se obtuvieron los proveedores exitosamente')
                        return res.json()
                    } else {
                        throw new Error('Error getting providers')
                    }
                })
                .then(setProviders)
                .catch(() => {
                    toast.error('Ocurrió un error al obtener los proveedores')
                })
                .finally(() => setLoading(false))
        }
        getProviders()
    },[])


    React.useEffect(() => {
        const channel=supabaseAnon
            .channel('providers-channel')
            .on(
                'postgres_changes',
                {event: '*',schema: 'public',table: 'providers'},
                (payload) => {
                    if(payload.eventType==='INSERT') {
                        setProviders(p => [...p,payload.new as IProvider])
                    }
                    else if(payload.eventType==='UPDATE') {
                        setProviders(p => p.map(provider => {
                            if(provider.id===payload.new?.id) {
                                const newProvider=payload.new as IProvider
                                return {
                                    ...provider,
                                    ...newProvider
                                }
                            }
                            return provider
                        }))
                    }
                    else if(payload.eventType==='DELETE') {
                        setProviders(p => p.filter(provider => provider.id!==payload.old.id))
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