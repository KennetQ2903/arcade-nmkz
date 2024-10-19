import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const formData: Awaited<User&{password: string}>=await request.json();

    const {data,error}=await supabaseAnon.auth.signUp({
        email: formData.email,
        password: formData.password
    })


    if(error) {
        console.log(error)
        return new Response(error.message,{status: 500})
    }

    const {error: insertError,status,statusText}=await supabaseAnon.from('usuarios').insert([
        {
            id: data?.user?.id,
            email: formData.email,
            name: formData.name,
            lastname: formData.lastname,
            rol_id: formData.rol_id,
            localidad_id: formData?.localidad_id||null,
            nit: formData?.nit||null,
            dpi: formData.dpi,
            fecha_nacimiento: formData.fecha_nacimiento,
            phone: formData.phone
        }
    ])


    if(insertError) {
        console.log(insertError,statusText)
        return new Response(insertError.message,{status})
    }


    return new Response("User created",{status})

}