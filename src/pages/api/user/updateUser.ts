import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const formData: Awaited<User>=await request.json();

    const {error,status}=await supabaseAnon
        .from('usuarios')
        .update({
            name: formData.name,
            lastname: formData.lastname,
            dpi: formData.dpi,
            nit: formData.nit,
            email: formData.email,
            phone: formData.phone,
            fecha_nacimiento: formData.fecha_nacimiento,
            rol_id: formData.rol_id,
            localidad_id: formData.localidad_id
        })
        .eq('id',formData.id)
        .select()

    if(error) {
        return new Response(error.message,{status})
    }

    return new Response("User updated",{status: 200})
}