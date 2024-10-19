import {zodResolver} from "@hookform/resolvers/zod"
import React from "react"
import {useCallback} from "react"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "../ui/form"
import {Input} from "../ui/input"
import {Loader2} from "lucide-react"
import {Button} from "../ui/button"
import {navigate} from "astro:transitions/client"
import {toast} from "sonner"

const formSchema=z.object({
    name: z.string({
        required_error: "Ingresa un nombre"
    }),
    phone: z.string({
        required_error: "Ingresa un telefono"
    }),
})

interface Props {
    action: 'edit'|'add'
    providerId?: string
}

type FormValues=z.infer<typeof formSchema>
export const ProviderForm: React.FC<Props>=({action,providerId}) => {
    const [loading,setLoading]=React.useState(false)
    const form=useForm<FormValues>({
        resolver: zodResolver(formSchema),
        reValidateMode: "onSubmit",
    })

    React.useEffect(() => {
        if(action==='edit') {
            const getProvider=async () => {
                return fetch(`/api/providers/getProviderById/${providerId}`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then(res => {
                        if(res.ok) {
                            return res.json()
                        } else {
                            throw new Error('Error getting provider')
                        }
                    })
                    .then(data => {
                        form.reset(data)
                    })
                    .catch(err => {
                        toast.error('Error obteniendo la información del proveedor')
                        console.log(err)
                    })
            }
            getProvider()
        }
    },[])

    const saveChanges=useCallback(async (data: FormValues) => {
        return fetch(`/api/providers/${action==='add'? 'createProvider':'updateProvider'}`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({...data,id: providerId}),
        })
            .then(res => {
                if(res.ok) {
                    return 
                } else {
                    throw new Error('Error creating provider')
                }
            })
            .finally(() => {
                setLoading(false)
            })
    },[])

    const handleSubmit=useCallback(async (data: FormValues) => {
        setLoading(true)
        toast.promise(() => saveChanges(data),{
            loading: 'Guardando cambios...',
            success: () => {
                setLoading(false)
                form.reset()
                setTimeout(() => navigate("/providers",{history: 'push'}),500)
                return 'Cambios guardados exitosamente'
            },
            error: (err) => {
                setLoading(false)
                return `Error guardando proveedor, codigo ${err instanceof Error? err.message:'Desconocido'}`
            },
        });
    },[])

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
                <Button type="submit" className="w-full mt-10" disabled={loading}>
                    {loading&&<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Guardar
                </Button>
            </form>
        </Form>
    )
}