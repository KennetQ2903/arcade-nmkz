import {Button} from "@/components/ui/button";
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import type {CellContext} from "@tanstack/react-table";
import {navigate} from "astro:transitions/client";
import {MoreHorizontal} from "lucide-react";
import {useCallback} from "react";
import {toast} from "sonner";

export const ContextMenu=({info}: {info: CellContext<IRepairTicket,unknown>}) => {
    const handleDelete=useCallback(async () => {
        return fetch('/api/repairs/deleteTicketById',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({id: info.cell.row.original.ticket_id})
        })
            .then(res => {
                if(res.ok) {
                    toast.success('Ticket borrado exitosamente')
                    return
                }
                else {
                    throw new Error('Error deleting ticket')
                }
            })
            .catch(err => {
                toast.error('Error tratando de borrar el ticket')
                console.log(err)
            })
    },[info])

    const handleCloseTicket=useCallback(async () => {},[])

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
                <DropdownMenuItem onClick={handleCloseTicket}>Cerrar ticket</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}