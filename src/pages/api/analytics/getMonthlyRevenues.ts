import {supabaseAnon} from "@/lib/supabaseAnon";
import type {APIRoute} from "astro";

export const GET: APIRoute=async () => {
    const {data,error}=await supabaseAnon.rpc('get_monthly_revenues',{year_input: new Date().getFullYear()})
    if(error) {
        return new Response(error.message,{status: 500})
    }

    return new Response(JSON.stringify(data),{status: 200,headers: {'Content-Type': 'application/json'}});
}