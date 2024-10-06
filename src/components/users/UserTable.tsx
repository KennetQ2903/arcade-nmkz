import {Badge,type BadgeProps} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {MoreHorizontal} from "lucide-react"
import {useEffect,useState} from "react"

type QueriedUser=User&{localidad: string|null,rol: string}

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
    columnHelper.accessor('email',{
        header: 'Correo',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('rol',{
        header: 'Rol',
        cell: info => <Badge variant={rolBadgeVariant[info.getValue()]}>{info.getValue()}</Badge>,
    }),
    columnHelper.accessor('created_at',{
        header: 'Creado el',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('localidad',{
        header: 'Localidad',
        cell: info => info.getValue()??'N/A',
    }),
    columnHelper.display({
        id: 'actions',
        header: '',
        cell: (info) => {
            const handleDelete=async () => {
                console.log(JSON.stringify(info.cell.row.original.id))
                return fetch('/api/query/deleteUserById',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({id: info.cell.row.original.id})
                })
                    .then(res => {
                        if(res.ok) {
                            window.location.reload()
                            return
                        }
                        else {
                            throw new Error('Error deleting user')
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete}>Eliminar</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    })
]

export const UserTable=() => {
    const [queriedUsers,setQueriedUsers]=useState<QueriedUser[]>([])
    const table=useReactTable({
        data: queriedUsers,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
    useEffect(() => {
        const getAllUsers=async () => {
            return fetch('/api/query/getAllUsers',{
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
        }

        getAllUsers()
    },[])

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