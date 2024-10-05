import {zodResolver} from "@hookform/resolvers/zod"
import {Loader2} from "lucide-react"
import {useCallback,useState} from "react"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "../ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage} from "../ui/form"
import {Input} from "../ui/input"

const formSchema=z.object({
    email: z.string().email({message: "Ingresa un correo valido"}),
    password: z.string().min(1,{message: "Ingresa una contraseña"}),
})

type FormValues=z.infer<typeof formSchema>

export const SigninForm=() => {
    const [loading,setLoading]=useState(false)
    const form=useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
        reValidateMode: "onSubmit",
    })

    const handleSubmit=useCallback(async (data: FormValues) => {
        setLoading(true)
        try {
            const response=await fetch('/api/auth/signin',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            if(!response.ok) {
                return form.setError("password",{message: "Credenciales incorrectas"})
            }
            form.reset()
            location.replace('/dashboard')
        } catch(error) {
            form.setError("password",{message: "Algo salio mal"})
        } finally {
            setLoading(false)
        }
    },[])

    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <img src="/logo.png" alt="Image" className="w-full object-contain" />
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Inicio de sesión</h1>
                        <p className="text-balance text-muted-foreground">Ingresa tu correo y contraseña para continuar</p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem >
                                        <FormLabel>Correo electrónico</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
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
                            <Button type="submit" className="w-full my-10" disabled={loading}>
                                {loading&&<Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Iniciar sesión
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <img src="/login-bg.jpg" alt="Image" className="h-screen w-full object-contain" />
            </div>
        </div>
    )
}