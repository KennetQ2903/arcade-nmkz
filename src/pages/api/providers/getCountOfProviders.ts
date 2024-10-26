import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const GET: APIRoute=async () => {
    const {data,error,status}=await supabaseAnon
        .from('providers')
        .select('id')

    if(error) {
        return new Response(error.message,{status})
    }

    return new Response(JSON.stringify([{total: data?.length}]),{status,headers: {'Content-Type': 'application/json'}});
}