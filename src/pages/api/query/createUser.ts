import {supabase} from "@/lib/supabase";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const formData: Awaited<User&{password: string}>=await request.json();

    const {data,error}=await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
    })

    if(error) {
        return new Response(error.message,{status: 500})
    }

    const {error: insertError,status}=await supabase.from('usuarios').insert({
        id: data?.user?.id,
        email: formData.email,
        name: formData.name,
        lastName: formData.lastname,
        rol_id: formData.rol_id,
        localidad_id: formData?.localidad_id||null,
        nit: formData?.nit||null,
        dpi: formData.dpi,
        fecha_nacimiento: formData.fecha_nacimiento
    })

    if(insertError) {
        return new Response(insertError.message,{status})
    }

    return new Response("User created",{status})

}