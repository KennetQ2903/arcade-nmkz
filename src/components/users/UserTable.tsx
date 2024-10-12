import {Badge,type BadgeProps} from "@/components/ui/badge"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {format} from "date-fns"
import {useEffect,useState} from "react"
import {ContextMenu} from "./ContextMenu"
import {TableSkeleton} from "../common/TableSkeleton"

export type QueriedUser=User&{localidad: string|null,rol: string}

const columnHelper=createColumnHelper<QueriedUser>()

const rolBadgeVariant: Record<string,BadgeProps["variant"]>={
    Admin: "default",
    Tecnico: "outline",
    Empleado: "secondary",
}

const columns=[
    columnHelper.accessor('name',{
        id: 'name',
        cell: info => info.getValue(),
        header: 'Nombre',
    }),
    columnHelper.accessor('lastname',{
        id: 'lastName',
        cell: info => info.getValue(),
        header: 'Apellido',
    }),
    columnHelper.accessor('email',{
        id: 'email',
        header: 'Correo',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('phone',{
        id: 'phone',
        header: 'Telefono',
        cell: info => info.getValue()??'N/A',
    }),
    columnHelper.accessor('rol',{
        id: 'rol',
        header: 'Rol',
        cell: info => <Badge variant={rolBadgeVariant[info.getValue()]}>{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('fecha_nacimiento',{
        id: 'fecha_nacimiento',
        header: 'Fecha de Nacimiento',
        cell: info => format(info.getValue(),'dd-MM-yyyy'),
    }),
    columnHelper.accessor('created_at',{
        id: 'created_at',
        header: 'Creado el',
        cell: info => format(info.getValue(),'dd-MM-yyyy HH:mm a'),
    }),
    columnHelper.accessor('localidad',{
        id: 'localidad',
        header: 'Localidad',
        cell: info => info.getValue()??'N/A',
    }),
    columnHelper.accessor('nit',{
        id: 'nit',
        header: 'NIT',
        cell: info => info.getValue()??'N/A',
    }),
    columnHelper.accessor('dpi',{
        id: 'dpi',
        header: 'DPI',
        cell: info => info.getValue(),
    }),
    columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => <ContextMenu info={info} />,
    })
]

export const UserTable=() => {
    const [queriedUsers,setQueriedUsers]=useState<QueriedUser[]>([])
    const [loading,setLoading]=useState(true)
    const table=useReactTable({
        data: queriedUsers,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    useEffect(() => {
        const getAllUsers=async () => {
            setLoading(true)
            return fetch('/api/user/getAllUsers',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    }
                    else {
                        throw new Error('Error getting users')
                    }
                })
                .then(setQueriedUsers)
                .catch(err => {
                    console.log(err)
                })
                .finally(() => setLoading(false))
        }

        getAllUsers()
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