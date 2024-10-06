import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {zodResolver} from "@hookform/resolvers/zod"
import {CalendarIcon,Loader2,UserPlus2} from "lucide-react"
import {useCallback,useEffect,useState} from "react"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "../ui/form"
import {Popover,PopoverContent,PopoverTrigger} from "../ui/popover"
import {Calendar} from "../ui/calendar"
import {cn} from "@/lib/utils"
import {format} from "date-fns"

const formSchema=z.object({
    name: z.string().min(1,{message: "Ingresa un nombre"}),
    lastname: z.string().min(1,{message: "Ingresa un apellido"}),
    email: z.string().email({message: "Ingresa un correo valido"}),
    password: z.string().min(1,{message: "Ingresa una contraseña"}),
    rol_id: z.string({
        required_error: "Selecciona un rol"
    }),
    localidad_id: z.string().optional(),
    nit: z.string().optional(),
    dpi: z.string().min(8,{message: "Ingresa un DPI valido"}),
    fecha_nacimiento: z.date({
        required_error: "La fecha de nacimiento es obligatoria",
    })
})

type FormValues=z.infer<typeof formSchema>

export const UserForm=() => {
    const [roles,setRoles]=useState<IRol[]>([])
    const [localidades,setLocalidades]=useState<ILocalization[]>([])
    const [loading,setLoading]=useState(false)
    const [open,setOpen]=useState(false)
    const form=useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            dpi: "",
            nit: "",
            name: "",
            lastname: "",
            rol_id: "",
            localidad_id: "",
            fecha_nacimiento: new Date(),
        },
        reValidateMode: "onSubmit",
    })

    useEffect(() => {
        const getAllRoles=async () => {
            return fetch('/api/query/getAllRoles',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting roles')
                    }
                })
                .then(setRoles)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllRoles()
    },[])

    useEffect(() => {
        const getAllLocalities=async () => {
            return fetch('/api/query/getAllLocalizations',{
                method: 'GET'
            })
                .then(res => {
                    if(res.ok) {
                        return res.json()
                    } else {
                        throw new Error('Error getting localities')
                    }
                })
                .then(setLocalidades)
                .catch(err => {
                    console.log(err)
                })
        }

        getAllLocalities()
    },[])

    useEffect(() => {
        form.reset()
    },[])

    const handleSubmit=useCallback(async (data: FormValues) => {
        console.log(data)
        // setLoading(true)
        // return fetch('/api/query/createUser',{
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data),
        // })
        //     .then(res => {
        //         if(res.ok) {
        //             return res
        //         } else {
        //             throw new Error('Error creating user')
        //         }
        //     })
        //     .then(() => {
        //         window.location.reload()
        //         form.reset()
        //         setOpen(false)
        //     })
        //     .catch(err => {
        //         console.log(err)
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })
    },[])


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button><UserPlus2 className="mr-2 h-5 w-5" />Crear nuevo usuario</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Crear Usuario</DialogTitle>
                    <DialogDescription>
                        Crea un nuevo usuario para tu organización
                    </DialogDescription>
                </DialogHeader>
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
                            name="lastname"
                            render={({field}) => (
                                <FormItem >
                                    <FormLabel>Apellido</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="dpi"
                            render={({field}) => (
                                <FormItem >
                                    <FormLabel>DPI</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="nit"
                            render={({field}) => (
                                <FormItem >
                                    <FormLabel>NIT (opcional)</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem >
                                    <FormLabel>Correo electrónico</FormLabel>
                                    <FormControl>
                                        <Input placeholder="tecnico@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="fecha_nacimiento"
                            render={({field}) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fecha de nacimiento</FormLabel>
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
                                                        format(field.value,"PPP")
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
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem >
                                    <FormLabel>Contraseña</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rol_id"
                            render={({field}) => (
                                <FormItem >
                                    <FormLabel>Rol</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione un rol" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Localidades</SelectLabel>
                                                {roles.map((rol) => (
                                                    <SelectItem
                                                        key={rol.id}
                                                        value={rol.id.toString()}
                                                    >{rol.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="localidad_id"
                            render={({field}) => (
                                <FormItem >
                                    <FormLabel>Localidad (opcional)</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione una localidad" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Localidades</SelectLabel>
                                                {localidades.map((localidad) => (
                                                    <SelectItem
                                                        key={localidad.id}
                                                        value={localidad.id.toString()}
                                                    >{localidad.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
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
            </DialogContent>
        </Dialog>
    )
}