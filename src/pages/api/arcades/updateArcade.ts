import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const formData: Awaited<IArcadeMachine>=await request.json();

    const {error,status}=await supabaseAnon.from('machines').update({
        serial: formData.serial,
        model: formData.model,
        brand: formData.brand,
        shop_id: formData.shop_id,
        assembly_technician_id: formData.assembly_technician_id,
        provider_motherboard_id: formData.provider_motherboard_id,
        provider_casing_id: formData.provider_casing_id,
        type_id: formData.type_id,
        state_id: formData.state_id,
    })
        .eq('id',formData.id)
        .select()

    if(error) {
        return new Response(error.message,{status})
    }

    return new Response("Arcade created",{status: 201})
}