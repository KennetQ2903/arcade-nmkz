import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuLabel,DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow} from "@/components/ui/table"
import {MoreHorizontal} from "lucide-react"
import type {FC} from "react"

interface CustomTableProps {
    headers: string[]
}

export const CustomTable: FC<CustomTableProps>=({headers}) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {headers.map((header) => (
                        <TableHead key={header} className="hidden md:table-cell">{header}</TableHead>
                    ))}
                    <TableHead>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
                    <TableCell className="font-medium"> Laser Lemonade Machine </TableCell>
                    <TableCell>
                        <Badge variant="default">Draft</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell"> $499.99 </TableCell>
                    <TableCell className="hidden md:table-cell"> 25 </TableCell>
                    <TableCell className="hidden md:table-cell"> 2023-07-12 10:42 AM </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}