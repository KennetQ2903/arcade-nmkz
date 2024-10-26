import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const GET: APIRoute=async () => {
    const {data,error}=await supabaseAnon.rpc('get_active_machines')
    if(error) {
        return new Response(error.message,{status: 500})
    }

    return new Response(JSON.stringify(data),{status: 200,headers: {'Content-Type': 'application/json'}});
}