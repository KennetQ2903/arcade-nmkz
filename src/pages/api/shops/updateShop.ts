import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const formData: Awaited<IShop>=await request.json();

    const {error,status}=await supabaseAnon.from('shops').update([{
        name: formData.name,
        phone: formData.phone,
        localidad_id: formData.localidad_id,
        direccion_completa: formData.direccion_completa,
        type: formData.type,
        fixed_amount: formData.fixed_amount,
        percentage: formData.percentage,
        last_negotiation_date: formData.last_negotiation_date,
    }])
        .eq('id',formData.id)
        .single()
    if(error) {
        return new Response(error.message,{status})
    }

    return new Response("Shop updated",{status: 200})
}