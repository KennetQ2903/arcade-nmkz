import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {supabaseAnon} from "@/lib/supabaseAnon"
import {createColumnHelper,flexRender,getCoreRowModel,useReactTable} from "@tanstack/react-table"
import {format} from "date-fns"
import React from "react"
import {TableSkeleton} from "../common/TableSkeleton"
import {Badge} from "../ui/badge"
import {ContextMenu} from "./ContextMenu"

const columnHelper=createColumnHelper<IRepairTicket>()

const columns=[
    columnHelper.accessor('ticket_id',{
        id: 'ticket_id',
        cell: info => info.getValue(),
        header: '#',
    }),
    columnHelper.accessor('machine_serial',{
        id: 'machine_serial',
        cell: info => info.getValue(),
        header: 'No.Serial de la Maquina',
    }),
    columnHelper.accessor('technician',{
        id: 'technician',
        cell: info => info.getValue(),
        header: 'Tecnico a cargo',
    }),
    columnHelper.accessor('machine_status',{
        id: 'machine_status',
        cell: info => <Badge>{info.getValue()}</Badge>,
        header: 'Estado de la Maquina',
    }),
    columnHelper.accessor('repair_started_at',{
        id: 'repair_started_at',
        header: 'Reparacion iniciada el',
        cell: info => format(info.getValue(),'dd-MM-yyyy HH:mm a'),
    }),
    columnHelper.accessor('repair_finished_at',{
        id: 'repair_finished_at',
        header: 'Reparacion finalizada el',
        cell: info => info?.getValue()? format(info?.getValue()??new Date(),'dd-MM-yyyy'):<Badge variant="secondary">En curso</Badge>,
    }),
    columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => <ContextMenu info={info} />,
    })
]


export const RepairsTable: React.FC=() => {
    const [loading,setLoading]=React.useState(true)
    const [tickets,setTickets]=React.useState<IRepairTicket[]>([])
    const table=useReactTable({
        data: tickets,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    React.useEffect(() => {
        const getAllTickets=async () => {
            setLoading(true)
            return fetch('/api/repairs/getAllTickets',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting tickets')
                    }
                })
                .then(setTickets)
                .catch(err => {
                    console.log(err)
                })
                .finally(() => setLoading(false))
        }

        getAllTickets()
    },[])

    React.useEffect(() => {
        const channel=supabaseAnon
            .channel('tickets-channel')
            .on(
                'postgres_changes',
                {event: '*',schema: 'public',table: 'repairs'},
                (payload) => {
                    if(payload.eventType==='UPDATE') {
                        setTickets(p => p.map(ticket => {
                            if(ticket.ticket_id===payload.new?.ticket_id) {
                                const newTicket=payload.new as IRepairTicket
                                return {
                                    ...ticket,
                                    ...newTicket
                                }
                            }
                            return ticket
                        }))
                    }
                    else if(payload.eventType==='DELETE') {
                        setTickets(p => p.filter(ticket => ticket.ticket_id!==payload.old.ticket_id))
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