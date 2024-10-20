import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const POST: APIRoute=async ({request}) => {
    const {ticket_id}: Awaited<Pick<IRepairTicket,'ticket_id'>>=await request.json();

    const {error,status}=await supabaseAnon.rpc("close_ticket",{ticket_id_to_close: ticket_id})

    console.log(error,status)

    if(error) {
        return new Response(error.message,{status})
    }

    return new Response("Ticket closed",{status: 201})

}