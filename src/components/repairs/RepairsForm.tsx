import {Button} from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useGetTicketDetails} from "@/hooks/useGetTicketDetails"
import {cn} from "@/lib/utils"
import {zodResolver} from "@hookform/resolvers/zod"
import {navigate} from "astro:transitions/client"
import {format} from "date-fns"
import {CalendarIcon,Loader2} from "lucide-react"
import {useCallback,useState} from "react"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"
import {Calendar} from "../ui/calendar"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "../ui/form"
import {Popover,PopoverContent,PopoverTrigger} from "../ui/popover"

const formSchema=z.object({
    machine_id: z.string({
        required_error: "Seleccione una máquina"
    }),
    technician_id: z.string({
        required_error: "Seleccione un tecnico"
    }),
    repair_started_at: z.date({
        required_error: "Seleccione la fecha de inicio de la reparación"
    }),
})

interface Props {
    action: 'edit'|'add'
    ticketId?: string
}

type FormValues=z.infer<typeof formSchema>

export const RepairsForm: React.FC<Props>=({ticketId=''}) => {
    const {arcades,technicians}=useGetTicketDetails()
    const [loading,setLoading]=useState(false)
    const form=useForm<FormValues>({
        resolver: zodResolver(formSchema),
        reValidateMode: "onSubmit",
    })

    const saveChanges=useCallback(async (data: FormValues) => {
        return fetch(`/api/repairs/createTicket`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data,id: ticketId}),
        })
            .then(res => {
                if(res.ok) {
                    return
                } else {
                    throw new Error(res?.statusText||'Desconocido')
                }
            })
    },[ticketId])

    const handleSubmit=useCallback(async (data: FormValues) => {
        setLoading(true)
        toast.promise(() => saveChanges(data),{
            loading: 'Guardando cambios...',
            success: () => {
                setLoading(false)
                form.reset()
                setTimeout(() => navigate("/repairs",{history: 'push'}),500)
                return 'Cambios guardados exitosamente'
            },
            error: (err) => {
                setLoading(false)
                return `Error creando ticket, codigo ${err instanceof Error? err.message:'Desconocido'}`
            },
        });
    },[])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="machine_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Maquina</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una maquina" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {arcades.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >{item.serial} - {item.model}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="technician_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Tecnico a cargo de la reparación</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tecnico" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {technicians.map((item) => (
                                        <SelectItem
                                            key={item.id}
                                            value={item.id.toString()}
                                        >{item.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="repair_started_at"
                    render={({field}) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Fecha de inicio de la reparación</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "pl-3 text-left font-normal",
                                                !field.value&&"text-muted-foreground"
                                            )}
                                        >
                                            {field.value? (
                                                format(field.value,"MM/dd/yyyy")
                                            ):(
                                                <span>Seleccione una fecha</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        fromDate={field.value? new Date(field.value):undefined}
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date>new Date()||date<new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full mt-10" disabled={loading}>
                    {loading&&<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar
                </Button>
            </form>
        </Form>
    )
}