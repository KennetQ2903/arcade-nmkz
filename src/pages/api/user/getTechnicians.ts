import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const GET: APIRoute=async () => {
    let {data,error,status}=await supabaseAnon
        .rpc('get_technicians')
    if(error) {
        return new Response(error.message,{status})
    }
    return new Response(JSON.stringify(data),{status,headers: {'Content-Type': 'application/json'}});
}