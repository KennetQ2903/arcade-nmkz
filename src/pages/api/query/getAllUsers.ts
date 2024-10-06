import {supabase} from "@/lib/supabase";
import type {APIRoute} from "astro";

export const GET: APIRoute=async () => {
    let {data,error,status}=await supabase
        .rpc('get_all_users')
    if(error) {
        return new Response(error.message,{status})
    }
    return new Response(JSON.stringify(data),{status,headers: {'Content-Type': 'application/json'}});
}