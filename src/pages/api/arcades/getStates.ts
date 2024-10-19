import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const GET: APIRoute=async () => {
    let {data,error,status}=await supabaseAnon
        .from('machine_states')
        .select('*')

    if(error) {
        return new Response(error.message,{status})
    }
    return new Response(JSON.stringify(data),{status,headers: {'Content-Type': 'application/json'}});
}