import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const formData: Awaited<Pick<IProvider,'name'|'phone'>>=await request.json();

    const {error,status}=await supabaseAnon.from('providers').insert([{
        name: formData.name,
        phone: formData.phone
    }])
    if(error) {
        return new Response(error.message,{status})
    }

    return new Response("Provider created",{status: 201})
}