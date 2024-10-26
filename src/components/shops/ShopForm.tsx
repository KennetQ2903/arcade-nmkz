import {useGetLocalizations} from "@/hooks/useGetLocalizations"
import {zodResolver} from "@hookform/resolvers/zod"
import {navigate} from "astro:transitions/client"
import React from "react"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "../ui/form"
import {Input} from "../ui/input"
import {Button} from "../ui/button"
import {CalendarIcon,Loader2} from "lucide-react"
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "../ui/select"
import {Popover,PopoverContent,PopoverTrigger} from "../ui/popover"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import {Calendar} from "../ui/calendar"

interface Props {
    action: 'edit'|'add'
    shopId?: string
}

const SHOP_TYPES=[
    {id: 'Minorista',name: 'Minorista'},
    {id: 'Mayorista',name: 'Mayorista'}
]

const formSchema=z.object({
    name: z.string({
        required_error: "Ingresa un nombre"
    }),
    phone: z.string({
        required_error: "Ingresa un telefono"
    }),
    localidad_id: z.string({
        required_error: "Selecciona una localidad"
    }),
    direccion_completa: z.string({
        required_error: "Ingresa una direccion"
    }),
    type: z.string({
        required_error: "Seleccione un tipo de comercio"
    }),
    fixed_amount: z
        .coerce
        .number({invalid_type_error: "Debe ser un número"})
        .min(0,{message: "La cantidad fija debe ser mayor o igual a 0"})
        .optional(),
    percentage: z
        .coerce
        .number({invalid_type_error: "Debe ser un número"})
        .min(0,{message: "El porcentaje debe ser mayor o igual a 0"})
        .max(100,{message: "El porcentaje no puede ser mayor a 100"})
        .optional(),
    last_negotiation_date: z.coerce.date().optional(),
}).refine(data => data.type!=="Minorista"||data.fixed_amount!==undefined,{
    message: "Debe ingresar una cantidad fija para minoristas",
    path: ["fixed_amount"]
})
    .refine(data => data.type!=="Mayorista"||data.percentage!==undefined,{
        message: "Debe ingresar un porcentaje para mayoristas",
        path: ["percentage"]
})

type FormValues=z.infer<typeof formSchema>

export const ShopForm: React.FC<Props>=({action,shopId=''}) => {
    const {localidades}=useGetLocalizations()
    const [loading,setLoading]=React.useState(false)
    const form=useForm<FormValues>({
        resolver: zodResolver(formSchema),
        reValidateMode: "onSubmit",
    })

    const saveChanges=React.useCallback(async (data: FormValues) => {
        return fetch(`/api/shops/${action==='add'? 'createShop':'updateShop'}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data,id: shopId}),
        })
            .then(res => {
                if(res.ok) {
                    return 
                } else {
                    throw new Error('Error creating shop')
                }
            })
            .finally(() => {
                setLoading(false)
            })
    },[])

    const handleSubmit=React.useCallback(async (data: FormValues) => {
        setLoading(true)
        toast.promise(() => saveChanges(data),{
            loading: 'Guardando cambios...',
            success: () => {
                setLoading(false)
                form.reset()
                setTimeout(() => navigate("/shops",{history: 'push'}),500)
                return 'Cambios guardados exitosamente'
            },
            error: (err) => {
                setLoading(false)
                return `Error guardando comercio, codigo ${err instanceof Error? err.message:'Desconocido'}`
            },
        });
    },[shopId,action])

    React.useEffect(() => {
        if(action==='edit') {
            const getShop=async () => {
                return fetch(`/api/shops/getShop/${shopId}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(res => {
                        if(res.ok) {
                            return res.json()
                        } else {
                            throw new Error('Error getting shop')
                        }
                    })
                    .then(data => {
                        form.reset(data)
                        form.setValue('localidad_id',data.localidad_id?.toString())
                        form.setValue('type',data.type?.toString())
                    })
                    .catch(err => {
                        toast.error('Error obteniendo la información del comercio')
                        console.log(err)
                    })
            }
            getShop()
        }
    },[shopId])


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Telefono</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="localidad_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Localidad</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione una localidad" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {localidades.map((localidad) => (
                                        <SelectItem
                                            key={localidad.id}
                                            value={localidad.id.toString()}
                                        >{localidad.name}
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
                    name="type"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Tipo de comercio</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo de comercio" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {SHOP_TYPES.map((localidad) => (
                                        <SelectItem
                                            key={localidad.id}
                                            value={localidad.id.toString()}
                                        >{localidad.name}
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
                    name="direccion_completa"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Direccion</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="fixed_amount"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Cantidad fija de recaudación (Minoristas)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="percentage"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Porcentaje de recaudación (Mayoristas)</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="last_negotiation_date"
                    render={({field}) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Fecha de última negociación</FormLabel>
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