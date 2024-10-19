import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useGetMachineDetails} from "@/hooks/useGetMachineDetails"
import {zodResolver} from "@hookform/resolvers/zod"
import {navigate} from "astro:transitions/client"
import {Loader2} from "lucide-react"
import React,{useCallback} from "react"
import {useForm} from "react-hook-form"
import {toast} from "sonner"
import {z} from "zod"
import {Button} from "../ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "../ui/form"
import {Input} from "../ui/input"

interface Props {
    action: 'edit'|'add'
    machineId?: string
}

const formSchema=z.object({
    serial: z.string({
        required_error: "Ingresa un serial"
    }),
    model: z.string({
        required_error: "Ingresa un modelo"
    }),
    brand: z.string({
        required_error: "Ingresa una marca"
    }),
    shop_id: z.string({
        required_error: "Selecciona una tienda"
    }),
    assembly_technician_id: z.string({
        required_error: "Selecciona un tecnico de montaje"
    }),
    provider_motherboard_id: z.string({
        required_error: "Selecciona un proveedor de la placa base"
    }),
    provider_casing_id: z.string({
        required_error: "Selecciona un proveedor de la carcasa"
    }),
    type_id: z.string({
        required_error: "Selecciona un tipo"
    }),
    state_id: z.string({
        required_error: "Selecciona un estado"
    })
})

type FormValues=z.infer<typeof formSchema>

export const ArcadeForm: React.FC<Props>=({action,machineId=''}) => {
    const {machineHealthStatus,machineTypes,providers,shops,technicians}=useGetMachineDetails()
    const [loading,setLoading]=React.useState(false)
    const form=useForm<FormValues>({
        resolver: zodResolver(formSchema),
        reValidateMode: "onSubmit",
    })

    React.useEffect(() => {
        if(action==='edit') {
            const getArcade=async () => {
                return fetch(`/api/arcades/getArcadeById/${machineId}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(res => {
                        if(res.ok) {
                            return res.json()
                        } else {
                            throw new Error('Error getting arcade')
                        }
                    })
                    .then(data => {
                        form.reset(data)
                        form.setValue('shop_id',data.shop_id?.toString())
                        form.setValue('assembly_technician_id',data.assembly_technician_id?.toString())
                        form.setValue('provider_motherboard_id',data.provider_motherboard_id?.toString())
                        form.setValue('provider_casing_id',data.provider_casing_id?.toString())
                        form.setValue('type_id',data.type_id?.toString())
                        form.setValue('state_id',data.state_id?.toString())
                    })
                    .catch(err => {
                        toast.error('Error obteniendo la información del arcade')
                        console.log(err)
                    })
            }
            getArcade()
        }
    },[machineId])

    const saveChanges=useCallback(async (data: FormValues) => {
        return fetch(`/api/arcades/${action==='add'? 'createArcade':'updateArcade'}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data,id: machineId}),
        })
            .then(res => {
                if(res.ok) {
                    return
                } else {
                    throw new Error('Error creating arcade')
                }
            })
    },[machineId,action])

    const handleSubmit=useCallback(async (data: FormValues) => {
        setLoading(true)
        toast.promise(() => saveChanges(data),{
            loading: 'Guardando cambios...',
            success: () => {
                setLoading(false)
                setTimeout(() => navigate("/arcades",{history: 'push'}),500)
                return 'Cambios guardados exitosamente'
            },
            error: () => {
                setLoading(false)
                return 'Error al guardar cambios'
            },
        });
    },[saveChanges])

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                <FormField
                    control={form.control}
                    name="serial"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Numero de serie</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="model"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Modelo</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="brand"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Marca</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Tipo de maquina</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un tipo" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {machineTypes.map((item) => (
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
                    name="state_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Estado de la maquina</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un estado" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {machineHealthStatus.map((item) => (
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
                    name="shop_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Comercio asignado</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un comercio" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {shops.map((item) => (
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
                    name="assembly_technician_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Tecnico a cargo</FormLabel>
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
                    name="provider_motherboard_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Proveedor de la placa base</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un proveedor" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {providers.map((item) => (
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
                    name="provider_casing_id"
                    render={({field}) => (
                        <FormItem >
                            <FormLabel>Proveedor de la carcasa</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccione un proveedor" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {providers.map((item) => (
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
                <Button type="submit" className="w-full mt-10" disabled={loading}>
                    {loading&&<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar
                </Button>
            </form>
        </Form>
    )
}