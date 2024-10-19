import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const GET: APIRoute=async ({params}) => {
    const {id}=params

    const {data,error,status}=await supabaseAnon
        .from('machines')
        .select('*')
        .eq('id',id)
        .single()

    if(error) {
        return new Response(error.message,{status})
    }

    return new Response(JSON.stringify(data),{status,headers: {'Content-Type': 'application/json'}});
}