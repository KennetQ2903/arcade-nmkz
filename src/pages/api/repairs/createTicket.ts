import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const formData: Awaited<IRepairTicket>=await request.json();

    const {error,status}=await supabaseAnon.from('repairs').insert([{
        machine_id: formData.machine_id,
        technician_id: formData.technician_id,
        repair_started_at: formData.repair_started_at,
    }])
    if(error) {
        return new Response(error.message,{status})
    }

    return new Response("Ticket created",{status: 201})

}