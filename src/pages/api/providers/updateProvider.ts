import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const formData: Awaited<Pick<IProvider,'name'|'phone'|'id'>>=await request.json();

    const {error,status}=await supabaseAnon
        .from('providers')
        .update({
            name: formData.name,
            phone: formData.phone
        })
        .eq('id',formData.id)
        .select()

    if(error) {
        return new Response(error.message,{status})
    }

    return new Response("Provider updated",{status: 200})
}