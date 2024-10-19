import {createColumnHelper,flexRender,getCoreRowModel,useReactTable} from "@tanstack/react-table";
import React from "react";
import {TableSkeleton} from "../common/TableSkeleton";
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "../ui/table";
import {format} from "date-fns";
import {Badge} from "../ui/badge";
import {supabaseAnon} from "@/lib/supabaseAnon";
import {ContextMenu} from "./ContextMenu";

const columnHelper=createColumnHelper<IArcadeMachine>()

const columns=[
    columnHelper.accessor('serial',{
        id: 'Serial',
        cell: info => info.getValue(),
        header: 'Serial',
    }),
    columnHelper.accessor('model',{
        id: 'model',
        cell: info => info.getValue(),
        header: 'Modelo',
    }),
    columnHelper.accessor('brand',{
        id: 'brand',
        cell: info => info.getValue(),
        header: 'Marca',
    }),
    columnHelper.accessor('created_at',{
        id: 'created_at',
        cell: info => format(info.getValue(),'dd-MM-yyyy HH:mm a'),
        header: 'Creada el',
    }),
    columnHelper.accessor('shop',{
        id: 'shop',
        cell: info => info.getValue(),
        header: 'Tienda',
    }),
    columnHelper.accessor('assembly_technician',{
        id: 'assembly_technician',
        cell: info => info.getValue(),
        header: 'Tecnico de montaje',
    }),
    columnHelper.accessor('provider_casing',{
        id: 'provider_casing',
        cell: info => info.getValue(),
        header: 'Proveedor de la carcasa',
    }),
    columnHelper.accessor('provider_motherboard',{
        id: 'provider_motherboard',
        cell: info => info.getValue(),
        header: 'Proveedor de la placa base',
    }),
    columnHelper.accessor('type',{
        id: 'type',
        cell: info => <Badge variant='default'>{info.getValue()}</Badge>,
        header: 'Tipo',
    }),
    columnHelper.accessor('state',{
        id: 'state',
        cell: info => <Badge variant='secondary'>{info.getValue()}</Badge>,
        header: 'Estado',
    }),
    columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => <ContextMenu info={info} />,
    })
]


export const ArcadeTable: React.FC=() => {

    const [loading,setLoading]=React.useState(true)
    const [arcades,setArcades]=React.useState<IArcadeMachine[]>([])
    const table=useReactTable({
        data: arcades,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    React.useEffect(() => {
        const getAllArcades=async () => {
            setLoading(true)
            return fetch('/api/arcades/getAllArcades',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting arcades')
                    }
                })
                .then(setArcades)
                .catch(err => {
                    console.log(err)
                })
                .finally(() => setLoading(false))
        }

        getAllArcades()
    },[])

    React.useEffect(() => {
        const channel=supabaseAnon
            .channel('machines-channel')
            .on(
                'postgres_changes',
                {event: '*',schema: 'public',table: 'machines'},
                (payload) => {
                    if(payload.eventType==='UPDATE') {
                        setArcades(p => p.map(machine => {
                            if(machine.id===payload.new?.id) {
                                const newMachine=payload.new as IArcadeMachine
                                return {
                                    ...machine,
                                    ...newMachine
                                }
                            }
                            return machine
                        }))
                    }
                    else if(payload.eventType==='DELETE') {
                        setArcades(p => p.filter(machine => machine.id!==payload.old.id))
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